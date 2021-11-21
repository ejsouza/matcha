import express from 'express';
import userService from '../services/users.service';
import passwordService, { Resource } from '../services/password.service';
import { EMAIL_REGEX, PASS_REGEX } from '../config/const';

class PasswordController {
  async resetPassword(req: express.Request, res: express.Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing email/password' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: `Invalid email address`,
      });
    }
    if (!PASS_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: `Password should be at least 8 characters long, must be composed with upper and lower letters, numbers and symbols.`,
      });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user account found with this email.`,
      });
    }

    const payload: Resource = {
      userId: user.id,
      username: user.firstname,
      password,
      email,
    };

    const count = await passwordService.resetPassword(payload);

    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: 'Password reset, check your email, we sent you a link.',
        count,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Could not reset password, try again later.',
      count,
    });
  }
}

export default new PasswordController();
