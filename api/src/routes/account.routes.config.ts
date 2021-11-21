import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import accountController from '../controllers/account.controller';

export class AccountRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'AccountRoutes');
  }

  configureRoutes() {
    this.app.route('/account').get(accountController.activateAccount);

    return this.app;
  }
}
