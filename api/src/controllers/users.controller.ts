import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class UserController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await userService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await userService.getById(req.body.id);
    res.status(200).send(user);
  }

  async createUser(req: express.Request, res: express.Response) {
    log('%0', 'createUser()');
    const result = await userService.create(req.body);
    res.status(201).send({ result });
  }

  async patchUser(req: express.Request, res: express.Response) {
    // const data = Object.entries(req.body).filter((val) => val[0] !== 'id');
    // console.log(`payload  := ${data}`);
    const user = await userService.patchById(req.params.userId, req.body);
    res.status(201).json({ user });
  }

  async patchUserCoordinates(req: express.Request, res: express.Response) {
    const user = await userService.patchUserCoordinates(
      req.params.userId,
      req.body
    );
    res.status(201).json({ user });
  }
}

export default new UserController();
