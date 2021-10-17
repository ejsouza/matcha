import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';

export class TagRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'TagRoutes');
  }

  configureRoutes() {
    this.app
      .route('/tags')
      .get((req: express.Request, res: express.Response) => {
        res.status(200).json({ tags: 'returning from get tags' });
      });

    return this.app;
  }
}
