import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';
import { MapUserDto } from '../dto/users/create.user.dto';

const log: debug.IDebugger = debug('app:users-controller');

class UserController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await userService.list(100, 0);
    res.status(200).send(users);
  }

  async getMatchingUsers(req: express.Request, res: express.Response) {
    const matches = await userService.match(req.body.userId);
    const users = await MapUserDto(matches);
    res.status(200).json({ users });
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
