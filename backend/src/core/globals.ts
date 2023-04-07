import Config, { ConfigInterface } from '@config';
import { Logger } from './logger';
import path from 'path';
import DB from '../models';

// Database Models

const config: ConfigInterface = Config();

// Export Global Variables
export { Logger };
export const App = {
  EXTENSION_ECOSYSTEM: path.extname(__filename) === '.js' ? 'js' : 'ts',
  Config: config,
  DB,
  Http: {
    app: null,
  },
};

// Assign them to Global
export const Global: any = global;
Global.Logger = Logger;
Global.App = App;
