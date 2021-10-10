import express from 'express';
import debug from 'debug';
import jwt from 'jsonwebtoken';
import usersService from '../services/users.service';
import { EXPIRES_IN, SECRET_TOKEN } from '../config/const';

const log: debug.IDebugger = debug('app:auth-controller');

class AuthController {
  async createJWT(req: express.Request, res: express.Response) {
    // const SECRET = process.env.JWT_SECRET;
    try {
      const user = await usersService.getUserWithoutPassword(req.body.username);
      const token = jwt.sign({ userId: user.id }, SECRET_TOKEN, {
        expiresIn: EXPIRES_IN,
      });
      console.log(`DO WE HAVE THE ID HERE ? ${req.body.userId}`);

      return res.status(201).send({ user, token });
    } catch (err) {
      log('createJWT error: %O', err);
      return res.status(500).send();
    }
  }
}

export default new AuthController();
