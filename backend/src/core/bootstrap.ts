import { App, Logger } from '@core/globals';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import { Application } from 'app';
import MailHelper from '@helpers/mail.helper';

export default async (_app: Application) => {
  // Do stuff that needs to be done before server start

  // Check sending email identity.
  await MailHelper.CheckIdentities();

  // Run any pending migrations.
  const sequelize = App.DB.sequelize;
  let migrationsPath: string;
  if (path.extname(__filename) === '.js') {
    migrationsPath = path.join(process.cwd(), './build/migrations/*.js');
  } else {
    migrationsPath = path.join(process.cwd(), './src/migrations/*.ts');
  }
  const umzug = new Umzug({
    migrations: {
      // indicates the folder containing the migration .js files
      // path: path.join(process.cwd(), './migrations'),
      glob: migrationsPath,
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
