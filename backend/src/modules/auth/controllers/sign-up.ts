import { App, Logger } from '@core/globals';
import requestValidator from '@helpers/request-validator.helper';
import { Request, Response } from 'express';
import { SignUpBodyDTO } from '../dtos/sign-up.dto';
import SESHelper from '@helpers/mail.helper';
import { createVerificationCode } from '@models/user';
import _ from 'lodash';
import { OtpCodeType } from '@core/constants/otp-code-type';

export default async function _SignUp(req: Request, res: Response) {
  const { hasError, error, sanitizedData } = await requestValidator(
    SignUpBodyDTO,
    req.body
  );
  if (hasError) {
    return res.unprocessableEntity({ error, message: error.message });
  }

  const { email, gender, firstName, lastName, countryCode, mobile } =
    sanitizedData;

  // Check if { Email } is available
  const exists = await App.DB.User.count({ where: { email } });
  if (exists) {
    return res.unprocessableEntity({
      error: 'Email already registered.',
    });
  }

  const user = {
    email,
    country_code: countryCode,
    mobile,
    first_name: firstName,
    last_name: lastName,
    gender,
    otp: [],
  };

  // Create User Document & Create email verification code
  user.otp.push(createVerificationCode(OtpCodeType.EMAIL));

  await App.DB.User.create(user);

  const verificationEmail = _.findLast(user.otp, [
    'codeType',
    OtpCodeType.EMAIL,
  ]);

  let message: string;
  // Send verification email
  try {
    const verifyEmailUrl = `${App.Config.GATEWAY_URL}/api/v1/auth/verify-email?email=${email}&code=${verificationEmail.code}`;
    await SESHelper.Send({
      to: [email],
      from: App.Config.AWS_SES_EMAIL_ID,
      subject: 'Verify your email.',
      replyTo: [],
      body: {
        text: `Hi ${firstName} ${lastName},
Verify your email by going to: ${verifyEmailUrl}`,
      },
    });
    message = 'Registration successful. Check your email to verify.';
  } catch (error) {
    Logger.error(error);
    message =
      "Registration successful. Request resend verification-email, if you didn't receive it.";
  }

  // // All Done
  return res.created({
    message,
  });
}
