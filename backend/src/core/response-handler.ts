import { Response } from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import _ from 'lodash';
import { Logger } from '@core/globals';

export const _registerResponders = async (response: Response) => {
  try {
    const responseDirectoryPath = resolve(`${__dirname}/../responses`);
    const responses = fs.readdirSync(responseDirectoryPath);
    for (let i = 0; i < responses.length; i++) {
      const responseFileName: string = responses[i];
      let responseFunctionName: string = responseFileName.split('.')[0];
      responseFunctionName = responseFunctionName
        ? _.camelCase(responseFunctionName)
        : null;
      /* eslint-disable */
      // prettier-ignore
      const targetFunction = (require(resolve(`${responseDirectoryPath}/${responseFileName}`))).default
      /* eslint-enable */
      if (typeof targetFunction === 'function') {
        response[responseFunctionName] = targetFunction;
      }
    }
  } catch (error) {
    Logger.error(error);
  }
};
