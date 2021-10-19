import express from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/const';

class PhotoMiddleware {
  async photoSize(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!req.file || req.file.size > 1024 * 1024 * 2) {
      return res.status(400).send({
        error: `Invalid file size, file shouldn't be bigger than 2Mb`,
      });
    }
    next();
  }

  async photoMimetype(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (
      req.file &&
      (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png')
    ) {
      return next();
    }
    return res
      .status(400)
      .send({ error: `Invalid file format, only jpeg, png are accepted` });
  }

  // async validJWTNeeded(
  //   req: express.Request,
  //   res: express.Response,
  //   next: express.NextFunction
  // ) {
  //   if (req.headers['authorization']) {
  //     try {
  //       const authorization = req.headers['authorization'].split(' ');
  //       if (authorization[0] !== 'Bearer') {
  //         return res.status(401).send({ error: 'Bearer type missing' });
  //       } else {
  //         /**
  //          * If jwt.verify() fails control flows to the catch() bellow
  //          * and 401 is returned
  //          */
  //         jwt.verify(authorization[1], SECRET_TOKEN);

  //         const decoded = jwt.decode(authorization[1]);
  //         const userId = (decoded as any).userId;
  //         /**
  //          *  Verify if user id matches user id in token
  //          */

  //         if (!Number(userId)) {
  //           return res.status(401).send({ error: 'Invalid token' });
  //         }
  //         /**
  //          * Valid token call next()
  //          */
  //         next();
  //       }
  //     } catch (err) {
  //       return res.status(403).send();
  //     }
  //   } else {
  //     return res.status(401).send({ error: 'Missing authorization token' });
  //   }
  // }
}

export default new PhotoMiddleware();
