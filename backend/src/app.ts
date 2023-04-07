import express, { Request, Response, NextFunction } from 'express';
import { Global, App, Logger } from '@core/globals';
import cors from 'cors';
import helmet from 'helmet';
import morganLogger from 'morgan';
import { _registerResponders } from '@core/response-handler';
import { AppRoutes } from './app.routes';
import { createWriteStream } from 'fs';
import { Environments } from '@core/constants/environments';

export class Application {
  private app: express.Application;

  constructor() {
    this.app = express();
    Global.App.Http.app = this.app;
    this.middleware();
    this.config();
    this.registerResponders();
    this.registerRoutes();
  }

  // Returns Express App
  express(): express.Application {
    return this.app;
  }

  // Configuration and Setup
  private config(): void {
    this.app.set('port', App.Config.PORT || 9000);
    this.app.set('env', App.Config.ENVIRONMENT || 'development');
    this.app.disable('x-powered-by');
  }

  // Http(s) request middleware
  private middleware(): void {
    if (App.Config.ENVIRONMENT !== Environments.TEST) {
      const logStream = createWriteStream(`${process.cwd()}/logs/request.log`, {
        flags: 'a',
      });
      this.app.use(
        morganLogger('dev', {
          stream: logStream,
        })
      );
    }
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  // Register Responders Dynamically
  private async registerResponders(): Promise<void> {
    this.app.use(
      async (_request: Request, response: Response, next: NextFunction) => {
        await _registerResponders(response);
        next();
      }
    );
  }

  // Register Routes
  private async registerRoutes(): Promise<void> {
    this.app.use('/api/v1', AppRoutes);

    this.app.get('/', (_req: Request, res: Response) => {
      return res.success({ message: 'Welcome' });
    });

    // Handle the 404 errors
    this.app.use((_req: Request, res: Response) => {
      return res.notFound();
    });
  }

  // Do things after the server starts
  async onServerStart(): Promise<any> {
    Logger.info(
      `App is running at http://localhost:${App.Config.PORT} in ${App.Config.ENVIRONMENT} mode.`
    );
    Logger.info('Press CTRL-C to stop');
  }
}

export default new Application();
