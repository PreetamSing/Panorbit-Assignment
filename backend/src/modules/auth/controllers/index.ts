import _SignUp from './sign-up';
import _VerifyEmail from './verify-email';

// TODO: verify-email and resend-verificaiton-mail api.
export default class AuthController {
  Signup = _SignUp;

  VerifyEmail = _VerifyEmail;
}
