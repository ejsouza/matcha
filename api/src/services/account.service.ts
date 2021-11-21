import userRepository from '../repositories/user.repository';
import userService from './users.service';
import jwt from 'jsonwebtoken';

class AccountService {
  async activateAccount(token: string) {
    let decoded: any;

    try {
      decoded = jwt.decode(token);
    } catch (err) {
      return -1;
    }

    /**
     * Better keep this if around!
     */
    if (!decoded) {
      return -1;
    }

    const userId = decoded?.userId as string;

    const user = await userService.getById(userId);
    if (!user) {
      return -1;
    }

    if (user.activated) {
      return 0;
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET!);

      const response = await userRepository.updateUserAccountActiveState(
        Number(userId),
        true
      );
      return response.rowCount;
    } catch (err) {
      return -1;
    }
  }
}

export default new AccountService();
