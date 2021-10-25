import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import tokenMiddleware from '../middleware/token.middleware';
import blockUserController from '../controllers/blockUser.controller';

export class BlockUserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'BlockUserRoutes');
  }

  configureRoutes() {
    this.app
      .route('/block')
      .get(blockUserController.listBlockedByUser)
      .post(tokenMiddleware.containValidJWT, blockUserController.create);

    return this.app;
  }
}
