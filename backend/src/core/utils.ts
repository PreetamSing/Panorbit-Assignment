import { Logger } from '@core/globals';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

export const FileExistsSync = (FilePath) => {
  return fs.existsSync(`${FilePath}.js`) || fs.existsSync(`${FilePath}.ts`);
};

export function GenerateRandomStringOfLength(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function GenerateRandomNumberOfLength(length) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function Wrap(controller: CallableFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      Logger.error(error);
      return res.internalServerError({ error });
    }
  };
}
