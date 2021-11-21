import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import passwordController from '../controllers/password.controller';

export class PasswordRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'PasswordRoutes');
  }
  configureRoutes() {
    this.app.route('/password').post(passwordController.resetPassword);
    return this.app;
  }
}
