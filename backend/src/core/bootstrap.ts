import { App, Logger } from '@core/globals';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { Application } from 'app';

export default async (_app: Application) => {
  // Do stuff that needs to be done before server start

  // Run any pending migrations.
  const sequelize = App.DB.sequelize;
  const umzug = new Umzug({
    migrations: {
      // indicates the folder containing the migration .js files
      // path: path.join(process.cwd(), './migrations'),
      glob: path.join(process.cwd(), './src/migrations/*.ts'),
    },
    // inject sequelize's QueryInterface in the migrations
    context: sequelize.getQueryInterface(),
    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    storage: new SequelizeStorage({ sequelize }),
    logger: Logger,
  });

  await umzug.up();
};
