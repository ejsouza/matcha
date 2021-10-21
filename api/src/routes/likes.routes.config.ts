import express, { response } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import likesController from '../controllers/likes.controller';
import userMiddleware from '../middleware/users.middleware';
import tokenMiddleware from '../middleware/token.middleware';
import likesMiddleware from '../middleware/likes.middleware';

export class LikeRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'LikeRoutes');
  }

  configureRoutes() {
    this.app
      .route(`/likes`)
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`GET /likes`);
      });

    /**
     * Add the userId from params available in body for all
     * subsequent routes
     */
    this.app.param('userId', userMiddleware.extractUserId);
    this.app
      .route(`/likes/:userId`)
      .all(userMiddleware.validateUserExists, tokenMiddleware.containValidJWT)
      .get(likesController.getUserLikes)
      .post(
        tokenMiddleware.validJWTNeeded,
        likesMiddleware.alreadyLiked,
        likesController.addUserLike
      );

    this.app
      .route(`/likes/:userId/dislike`)
      .all(userMiddleware.validateUserExists, tokenMiddleware.containValidJWT)
      .get(likesController.getUserDislikes)
      .post(
        tokenMiddleware.validJWTNeeded,
        likesMiddleware.alreadyDisliked,
        likesController.addUserDislike
      );

    return this.app;
  }
}
