import * as Joi from '@hapi/joi';
import 'joi-extract-type';

export const VerifyEmailQueryDTO = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
});
