import express from 'express';
import * as http from 'http';
import dotenv from 'dotenv';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UserRoutes } from './routes/users.routes.config';
import { AuthRoutes } from './routes/auth.routes.config';
import { PhotoRoutes } from './routes/photos.routes.config';
import { TagRoutes } from './routes/tags.routes.config';
import { LikeRoutes } from './routes/likes.routes.config';
import { BlockUserRoutes } from './routes/blockUser.routes.config';
import { ReportUserRoutes } from './routes/reportUser.routes.config';
import { VisitUserProfileRoutes } from './routes/visitUserProfile.routes.config';
import debug from 'debug';

/**
 * We don’t need to import the 'dotenv' library elsewhere because importing it in app.ts
 * makes the contents of the '.env' file available throughout the app via the Node.js
 * global object called 'process'
 */

dotenv.config();

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
/**
 * Make uploads directory public
 */
app.use('/uploads', express.static('uploads'));
app.use(cors());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new UserRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new PhotoRoutes(app));
routes.push(new TagRoutes(app));
routes.push(new LikeRoutes(app));
routes.push(new BlockUserRoutes(app));
routes.push(new ReportUserRoutes(app));
routes.push(new VisitUserProfileRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${PORT}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

server.listen(PORT, async () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  // let retries = 10;
  // while (retries) {
  //   try {
  //     // db.runMigrations();
  //     const client = await db.connect();
  //     await client.query('SELECT  NOW()');
  //     client.release();
  //     break;
  //   } catch (err) {
  //     retries--;
  //     console.log(`retries left := ${retries}`);
  //     // wait 5 seconds
  //     await new Promise((res) => setTimeout(res, 5000));
  //   }
  // }
  // our only exception to avoiding console.log(), because we
  // always want to know when the server is done starting up
  console.log(runningMessage);
});
