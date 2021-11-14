import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import tokenMiddleware from '../middleware/token.middleware';
import matchController from '../controllers/match.controller';

export class MatchRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'MatchRoutes');
  }

  configureRoutes() {
    this.app
      .route('/matches')
      .all(tokenMiddleware.containValidJWT)
      .get(tokenMiddleware.extractUserIdFromToken, matchController.get)
      .post(matchController.create)
      .delete(matchController.delete);

    this.app
      .route('/matches/:id')
      .all(tokenMiddleware.containValidJWT)
      .patch(matchController.update);
    return this.app;
  }
}
