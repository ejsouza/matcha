import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';
import { PASS_REGEX, EMAIL_REGEX } from '../config/const';

const log: debug.IDebugger = debug('app:users-middleware');

class UserMiddleware {
  async validateRequiredUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (
      req.body &&
      req.body.username &&
      req.body.firstname &&
      req.body.lastname &&
      req.body.email &&
      req.body.password
    ) {
      if (!EMAIL_REGEX.test(req.body.email)) {
        return res.status(400).send({
          error: `Invalid email address`,
        });
      }
      if (!PASS_REGEX.test(req.body.password)) {
        return res.status(400).send({
          error: `Password should be at least 8 characters long, including upper and lower letters, numbers and symbols`,
        });
      }
      next();
    } else {
      res.status(400).send({
        error: `Missing required fields`,
      });
    }
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!req.body.email) {
      res.status(400).send({
        error: `Missing email`,
      });
      return;
    }
    const user = await userService.getUserByEmail(req.body.email);
    /**
     * The 'user' type is an CreateUserDto, so only checking for < if (user){} > will fails
     * becuase it will not be falsy but an object, for this reason I use:
     * Object.entries(user).length
     * that will have length = 0 if no was user found or length = 1 otherwise.
     */
    if (user) {
      res.status(400).send({
        error: `User email already exists`,
      });
    } else {
      next();
    }
  }

  async validateSameUsernameDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!req.body.username) {
      res.status(400).send({
        error: `Missing username`,
      });
      return;
    }
    const user = await userService.getUserByUsername(req.body.username);
    console.log(`userService.getUserByUsername() ${user} -- ${user?.username}`);
    if (user) {
      console.log(`UserMiddleware --> ${user.username}`);
      res.status(400).send({
        error: `Username already exists`,
      });
    } else {
      next();
    }
  }

  async validateSameEmailBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!req.body.email) {
      res.status(400).send({
        error: `Missing email`,
      });
      return;
    }
    const user = await userService.getUserByEmail(req.body.email);
    if (user && user.id === Number(req.params.userId)) {
      next();
    } else {
      res.status(400).send({ error: `Invalid email` });
    }
  }

  // Here we need to use an arrow function to bind `this` correctly
  validatePatchEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body.email) {
      log('Validating email', req.body.email);

      this.validateSameEmailBelongToSameUser(req, res, next);
    } else {
      next();
    }
  };

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!req.params.userId) {
      res.status(400).send({
        error: 'Missing userId',
      });
      return;
    }
    const user = await userService.getById(req.params.userId);
    if (user) {
      next();
    } else {
      res.status(404).send({
        error: `User ${req.params.userId} not found`,
      });
    }
  }

  async validateUserIdIsInBody(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!req.params.userId) {
      res.status(400).send({
        error: 'Missing userId',
      });
      return;
    }
    const user = await userService.getById(req.body.userId);
    if (user) {
      next();
    } else {
      res.status(404).send({
        error: `User not found`,
      });
    }
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userId = req.params.userId;
    if (!userId || userId === 'undefined') {
      res.status(400).send({
        error: 'Missing userId',
      });
      return;
    }
    req.body.id = userId;
    next();
  }
}

export default new UserMiddleware();
