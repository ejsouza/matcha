import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import userController from '../controllers/users.controller';
import userMiddleware from '../middleware/users.middleware';
import tokenMiddleware from '../middleware/token.middleware';

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UserRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/users`)
      .get(
        tokenMiddleware.containValidJWT,
        tokenMiddleware.extractUserIdFromToken,
        userMiddleware.extractUserId,
        userController.getMatchingUsers
      )
      .post(
        userMiddleware.validateRequiredUserBodyFields,
        userMiddleware.validateSameEmailDoesntExist,
        userMiddleware.validateSameUsernameDoesntExist,
        userController.createUser
      );

    this.app.param(`userId`, userMiddleware.extractUserId);

    this.app
      .route(`/users/:userId`)
      .all(userMiddleware.validateUserExists)
      .get(userController.getUserById)
      .put((req: express.Request, res: express.Response) => {
        res.status(200).send(`PUT request for id ${req.params.userId}`);
      })
      .patch(tokenMiddleware.validJWTNeeded, userController.patchUser)
      .delete((req: express.Request, res: express.Response) => {
        res.status(200).send(`DELETE request for id ${req.params.userId}`);
      });

    this.app
      .route(`/users/:userId/coordinates`)
      .all(userMiddleware.validateUserExists)
      .patch(
        tokenMiddleware.validJWTNeeded,
        userController.patchUserCoordinates
      );
    return this.app;
  }
}
