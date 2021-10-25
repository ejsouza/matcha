import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import tokenMiddleware from '../middleware/token.middleware';
import reportUserController from '../controllers/reportUser.controller';

export class ReportUserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'ReportUserRoutes');
  }

  configureRoutes() {
    this.app
      .route('/report')
      .get(reportUserController.listReportedByUser)
      .post(tokenMiddleware.containValidJWT, reportUserController.create);

    return this.app;
  }
}
