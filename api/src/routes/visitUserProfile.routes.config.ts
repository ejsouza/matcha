import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import visitUserProfileController from '../controllers/visitUserProfile.controller';
import tokenMiddleware from '../middleware/token.middleware';

export class VisitUserProfileRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'VisitUserProfileRoutes');
  }

  configureRoutes() {
    this.app
      .route('/visits')
      .all(tokenMiddleware.containValidJWT)
      .get(
        tokenMiddleware.extractUserIdFromToken,
        visitUserProfileController.list
      )
      .post(visitUserProfileController.create)
      .put(visitUserProfileController.put)
      .patch(visitUserProfileController.update);

    return this.app;
  }
}
