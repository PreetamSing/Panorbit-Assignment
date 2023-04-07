import { Gender } from '@core/constants/gender';
import * as Joi from '@hapi/joi';
import 'joi-extract-type';

export const SignUpBodyDTO = Joi.object({
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .required() as Joi.BoxStringSchema<Joi.Box<Gender, true>>,
  email: Joi.string().email().lowercase().required(),
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50),
  countryCode: Joi.string().regex(/\+\d+/).min(1).max(6).required(),
  mobile: Joi.string().regex(/\d+/).min(6).max(11).required(),
});
