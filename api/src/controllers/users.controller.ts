import express from 'express';
import usersService from '../services/users.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list(100, 0);
    res.status(200).send(users);
  }

  async createUser(req: express.Request, res: express.Response) {
    const result = await usersService.create(req.body);
    res.status(201).send({ result });
  }
}

export default new UsersController();
