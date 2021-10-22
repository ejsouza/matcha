import express from 'express';
import bcrypt from 'bcrypt';
import usersService from '../services/users.service';
import * as jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/const';

class TokenMiddleware {
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
          /**
           * Valid token call next()
           */
          next();
        }
      } catch (err) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send({ error: 'Missing authorization token' });
    }
  }

  /**
   * The only difference between validJWTNeeded and containValidJWT
   * is containValidJWT checks only for a present valid token
   * while validJWTNeeded checks for valid presend token and
   * that the token id matchs the param id.
   * (remember the the req.body.id is set from params userId)
   */
  async containValidJWT(
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

          if (!Number(userId)) {
            return res.status(401).send({ error: 'Invalid token' });
          }
          /**
           * Valid token call next()
           */
          next();
        }
      } catch (err) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send({ error: 'Missing authorization token' });
    }
  }

  /**
   *  This function should only be called after
   *  one that checks for a valid token.
   *  No check will be made here.
   */
  async extractUserIdFromToken(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const authorization = req.headers['authorization']?.split(' ');
    const decoded = jwt.decode(authorization![1]);
    const userId = (decoded as any).userId;
    req.body.userId = userId;
    next();
  }
}

export default new TokenMiddleware();
