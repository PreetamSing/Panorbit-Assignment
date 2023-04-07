import { App } from '@core/globals';
import requestValidator from '@helpers/request-validator.helper';
import { Request, Response } from 'express';
import { VerifyEmailQueryDTO } from '../dtos/verify-email.dto';
import _ from 'lodash';
import { OtpCodeType } from '@core/constants/otp-code-type';

export default async function _VerifyEmail(req: Request, res: Response) {
  const { hasError, error, sanitizedData } = await requestValidator(
    VerifyEmailQueryDTO,
    req.query
  );
  if (hasError) {
    return res.unprocessableEntity({ error, message: error.message });
  }

  const { email, code } = sanitizedData;

  // Fetch the user with email
  const user = await App.DB.User.findByPk(email);

  if (!user) {
    return res.badRequest({
      message: 'Account does not exist.',
    });
  }

  if (user.email_verified_at) {
    return res.badRequest({
      message: 'Your account is already verified.',
    });
  }

  const verificationEmail = _.findLast(user.otp, [
    'codeType',
    OtpCodeType.EMAIL,
  ]);

  if (!verificationEmail || verificationEmail.code !== code.toString()) {
    return res.unauthorized();
  }

  // Remove email verification object.
  _.remove(user.otp, { codeType: OtpCodeType.EMAIL });
  user.setDataValue('otp', user.otp.length ? user.otp : null);
  // Update email verified at property.
  user.email_verified_at = new Date();
  // Save the updates.
  await user.save();

  return res.success({
    message: 'Email verification successful!',
  });
}
