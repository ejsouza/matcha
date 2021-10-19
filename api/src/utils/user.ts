import express from 'express';
import * as jwt from 'jsonwebtoken';

const retrieveUserIdFromToken = (req: express.Request) => {
  const authorization = req.headers['authorization']?.split(' ');

  if (!authorization) {
    return '';
  }
  const decoded = jwt.decode(authorization[1]);
  const userId: string = (decoded as any).userId;

  return userId;
};

export { retrieveUserIdFromToken };
