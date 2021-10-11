import express from 'express';
import bcrypt from 'bcrypt';
import usersService from '../services/users.service';
import * as jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/const';

class AuthMiddleware {
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await usersService.getUserByUsername(req.body.username);

    if (user) {
      const authentication = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (authentication) {
        return next();
      }
    }

    res.status(400).send({
      error: 'Invalid username and/or password',
    });
  }

  async validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers['authorization']) {
      try {
        const authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
          return res.status(401).send({ error: 'Bearer type missing' });
        } else {
          /**
           * If jwt.verify() fails control flows to the catch() bellow
           * and 401 is returned
           */
          jwt.verify(authorization[1], SECRET_TOKEN);

          const decoded = jwt.decode(authorization[1]);
          const userId = (decoded as any).userId;
          /**
           *  Verify if user id matches user id in token
           */

          if (Number(userId) !== Number(req.body.id)) {
            return res.status(401).send();
          }
          next();
        }
      } catch (err) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send({ error: 'Missing authorization token' });
    }
  }
}

export default new AuthMiddleware();
