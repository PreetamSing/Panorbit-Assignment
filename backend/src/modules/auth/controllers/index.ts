import _SignIn from './sign-in';
import _SignUp from './sign-up';
import _VerifyEmail from './verify-email';

export default class AuthController {
  Signup = _SignUp;

  SignIn = _SignIn;

  VerifyEmail = _VerifyEmail;
}
