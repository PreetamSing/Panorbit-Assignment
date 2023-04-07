import { SignInGrantType } from '@core/constants/otp-code-type';
import * as Joi from '@hapi/joi';
import 'joi-extract-type';

export const SignInBodyDTO = Joi.object({
  grantType: Joi.string()
    .valid(...Object.values(SignInGrantType))
    .required() as Joi.BoxStringSchema<Joi.Box<SignInGrantType, true>>,
  email: Joi.string().email().lowercase().required(),
  otp: Joi.string(),
});
