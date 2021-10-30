import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import tokenMiddleware from '../middleware/token.middleware';
import messagesController from '../controllers/messages.controller';

export class MessageRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'MessageRoutes');
  }

  configureRoutes() {
    this.app
      .route('/messages')
      .all(
        tokenMiddleware.containValidJWT,
        tokenMiddleware.extractUserIdFromToken
      )
      .get(messagesController.listUserMessages)
      .post(messagesController.create);

    this.app
      .route('/messages/:messageId')
      .all(tokenMiddleware.containValidJWT)
      .patch(messagesController.update)
      .delete(messagesController.delete);

    return this.app;
  }
}
