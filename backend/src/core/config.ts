import { Environments } from './constants/environments';

export interface ConfigInterface {
  PORT: number;
  ENVIRONMENT: Environments;
  PVT_KEY_SECRET: string;
  JWT_EXPIRY_SECS: number;
  AWS_SES_EMAIL_ID: string;
  SALT_ROUNDS: number;
  GATEWAY_URL: string;
}

export default (): ConfigInterface => {
  const { NODE_ENV = Environments.DEV } = process.env;
  if (!Object.keys(Environments).includes(NODE_ENV)) {
    throw new Error('Invalid NODE_ENV');
  }

  const environment = NODE_ENV as Environments;

  return {
    PORT: parseInt(process.env[`${environment}_PORT`]),
    ENVIRONMENT: environment,
    PVT_KEY_SECRET: process.env.PVT_KEY_SECRET,
    JWT_EXPIRY_SECS: parseInt(process.env.JWT_EXPIRY_SECS),
    AWS_SES_EMAIL_ID: process.env.AWS_SES_EMAIL_ID,
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),

    GATEWAY_URL: process.env[`${environment}_GATEWAY_URL`],
  };
};
