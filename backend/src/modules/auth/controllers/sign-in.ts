import { App, Logger } from '@core/globals';
import requestValidator from '@helpers/request-validator.helper';
import { Request, Response } from 'express';
import JWTHelper from '@helpers/jwt.helper';
import { SignInBodyDTO } from '../dtos/sign-in.dto';
import _ from 'lodash';
import SMSHelper from '@helpers/sms.helper';
import { createVerificationCode } from '@models/user';
import { OtpCodeType, SignInGrantType } from '@core/constants/otp-code-type';

export default async function _SignIn(req: Request, res: Response) {
  const { hasError, error, sanitizedData } = await requestValidator(
    SignInBodyDTO,
    req.body
  );
  if (hasError) {
    return res.unprocessableEntity({ error, message: error.message });
  }
  const { grantType, email } = sanitizedData;
  // Fetch the user with email
  const user = await App.DB.User.findByPk(email);

  if (!user) {
    return res.unauthorized();
  }

  if (!user.email_verified_at) {
    return res.unauthorized({
      message: 'Your email is not verified yet.',
    });
  }

  // @ts-ignore
  user.otp = user.otp ? JSON.parse(user.otp) : [];

  if (grantType === SignInGrantType.EMAIL) {
    // Create new 2FA code

    _.remove(user.otp, { codeType: OtpCodeType.MOBILE });
    user.otp.push(createVerificationCode(OtpCodeType.MOBILE));
    const verification2FA = _.findLast(user.otp, [
      'codeType',
      OtpCodeType.MOBILE,
    ]);

    user.setDataValue('otp', JSON.stringify(user.otp));
    // Save changes to user.
    await user.save();
    // Send SMS with OTP
    try {
      SMSHelper.Send({
        phone: user.country_code.trim() + user.mobile,
        message: `Hi ${user.first_name},
OTP code for your request is ${verification2FA.code}`,
      });
    } catch (error) {
      Logger.error(error);
    }

    const ending4Digits = user.mobile.slice(-4);
    const startingDigits = user.mobile.slice(0, -4).replace(/./g, '*');

    const item = {
      countryCode: user.country_code,
      phoneNumber: startingDigits + ending4Digits,
    };

    // All Done
    return res.success({
      message: 'OTP sent successfully.',
      referenceCode: verification2FA.referenceCode,
      item,
    });
  } else {
    // Check if the "code" is correct
    const { otp } = sanitizedData;
    if (!otp) {
      res.badRequest();
    }
    const verification2FA = _.findLast(user.otp, [
      'codeType',
      OtpCodeType.MOBILE,
    ]);
    if (!verification2FA) {
      return res.unauthorized();
    }
    if (verification2FA.code !== otp) {
      return res.unauthorized({
        message: 'Invalid OTP. Please try again.',
      });
    }
    // Nullify Mobile code
    _.remove(user.otp, { codeType: OtpCodeType.MOBILE });
    user.setDataValue('otp', user.otp ? JSON.stringify(user.otp) : null);
    // Save the updates.
    await user.save();

    // Generate a new JWT token
    const token = JWTHelper.GenerateToken({
      _id: user.email,
    });
    // Issue JWT to the user
    return res.success({
      message: 'Login Successful.',
      token,
    });
  }
}
