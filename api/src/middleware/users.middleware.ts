import express from 'express';
import userService from '../services/users.service';
import debug from 'debug';

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
    req.body.id = req.params.userId;
    next();
  }
}

export default new UserMiddleware();
