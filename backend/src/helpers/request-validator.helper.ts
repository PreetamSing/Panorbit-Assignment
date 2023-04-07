import * as Joi from '@hapi/joi';
import { ValidationErrorItem } from 'joi';
import 'joi-extract-type';

interface ValidationResult<
  T extends Joi.BoxObjectSchema<A>,
  A extends Joi.BoxSchema
> {
  hasError: boolean;
  error: ValidationErrorItem;
  sanitizedData: Joi.extractType<T>;
}

const requestValidator = async <
  T extends Joi.BoxObjectSchema<A>,
  A extends Joi.BoxSchema
>(
  DTO: T,
  requestProperties: any
): Promise<ValidationResult<T, A>> => {
  const validation = DTO.validate(requestProperties);
  let hasError = false;
  let error = null;

  if (validation.error) {
    error = validation.error.details[0];
    hasError = true;
  }

  return { hasError, error, sanitizedData: validation.value };
};
export default requestValidator;
