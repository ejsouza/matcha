import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository';
import { sendResetPasswordMailToken } from '../utils/email';
import { SALT_ROUNDS } from '../config/const';

export interface Resource {
  userId: number;
  username: string;
  password: string;
  email: string;
}

class PasswordService {
  async resetPassword(user: Resource) {
    /**
     * Hash password before saving to db
     */
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
    /**
     * Reset password
     */
    const resPass = await userRepository.resetPassword(
      user.userId,
      hashedPassword
    );
    /**
     * Lock user account
     */
    const resStatus = await userRepository.updateUserAccountActiveState(
      user.userId,
      false
    );
    /**
     * Create token
     */
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    const res = sendResetPasswordMailToken(user.username, user.email, token);

    return resPass.rowCount + resStatus.rowCount;
  }
}

export default new PasswordService();
