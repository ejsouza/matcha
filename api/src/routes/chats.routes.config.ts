import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import tokenMiddleware from '../middleware/token.middleware';
import chatController from '../controllers/chats.controller';

export class ChatRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'ChatRoutes');
  }

  configureRoutes() {
    this.app
      .route('/chat')
      .all(
        tokenMiddleware.containValidJWT,
        tokenMiddleware.extractUserIdFromToken
      )
      .get(chatController.list)
      .post(chatController.create);

    this.app
      .route('/chat/:userId/received')
      .all(tokenMiddleware.containValidJWT)
      .get(chatController.listReceived);

    this.app
      .route('/chat/:userId/sent')
      .all(tokenMiddleware.containValidJWT)
      .get(chatController.listSent);
    return this.app;
  }
}
