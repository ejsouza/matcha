import express from 'express';
import userService from '../services/users.service';
import likesService from '../services/likes.service';
import debug from 'debug';
import { MapUserDto } from '../dto/users/create.user.dto';
import { MapUsersMatchedDto } from '../dto/users/match.user.dto';

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

  async getUserMatches(req: express.Request, res: express.Response) {
    const likedBy = await likesService.getLikedBy(req.params.userId);
    const likes = await likesService.getUserLikes(req.params.userId);
    const matches = await MapUsersMatchedDto(likedBy, likes);

    res.status(200).json({ matches });
  }

  async getUserById(req: express.Request, res: express.Response) {
    const userId = req.body.id;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ success: false, message: 'Missing user.id' });
    }
    const user = await userService.getById(userId);
    res.status(200).send(user);
  }

  async getUserAllDetails(req: express.Request, res: express.Response) {
    const user = await userService.getUserAllDetails(req.params.userId);
    res.status(200).json({ user });
  }

  async getUserLikedBy(req: express.Request, res: express.Response) {
    const userId = req.params.userId;

    if (!userId || userId === 'undefined') {
      return res
        .status(400)
        .json({ success: false, message: 'Missing user.id' });
    }
    const users = await userService.getUserLikedBy(userId);
    res.status(200).json({ users });
  }

  async createUser(req: express.Request, res: express.Response) {
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

  async patchUserAgePreferences(req: express.Request, res: express.Response) {
    const { min, max } = req.body;
    const userId = Number(req.params.userId);
    if (!userId || !min || !max) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing age userId/min/max' });
    }
    const count = await userService.patchUserAgePreferences(userId, min, max);

    res.status(201).json({ success: true, count });
  }

  async patchUserDistancePreferences(
    req: express.Request,
    res: express.Response
  ) {
    const distance = req.body.distance;
    const userId = Number(req.params.userId);

    if (!userId || !distance) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing userId/distance' });
    }

    const count = await userService.patchUserDistancePreferences(
      userId,
      Number(distance)
    );

    res.status(201).json({ success: true, count });
  }
}

export default new UserController();
