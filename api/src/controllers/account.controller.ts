import express from 'express';
import accountService from '../services/account.service';

class AccountController {
  async activateAccount(req: express.Request, res: express.Response) {
    const token = req.query.token;

    if (!token) {
      console.log(`Missing token := ${token}`);
      return res
        .status(400)
        .json({ success: false, message: 'Missing token param' });
    }
    const count = await accountService.activateAccount(token.toString());

    if (count > 0) {
      return res
        .status(200)
        .json({ success: true, message: 'Account activated successfully!' });
    }
    if (count === 0) {
      return res
        .status(200)
        .json({ success: true, message: 'Account already verified!' });
    }
    res.status(400).json({ success: false, message: 'Expired/Invalid token' });
  }
}

export default new AccountController();
