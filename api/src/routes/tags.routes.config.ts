import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import tagController from '../controllers/tags.controller';
import usersMiddleware from '../middleware/users.middleware';
import tokenMiddleware from '../middleware/token.middleware';

export class TagRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'TagRoutes');
  }

  configureRoutes() {
    this.app
      .route('/tags')
      .post(tokenMiddleware.containValidJWT, tagController.create);

    this.app
      .route('/tags/:userId')
      .all(usersMiddleware.validateUserExists, tokenMiddleware.containValidJWT)
      .get(tagController.getUserTags)
      .delete(tagController.delete);
    this.app
      .route('/tags/:userId/all')
      .all(usersMiddleware.validateUserExists, tokenMiddleware.containValidJWT)
      .get(tagController.listAllUserAvailableTags);
    return this.app;
  }
}
