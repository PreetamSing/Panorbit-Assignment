import { Request, Response, Router } from 'express';
import AuthController from '@modules/auth/controllers';
import { Wrap } from '@core/utils';

const authController = new AuthController();
const router = Router();

router.get('/ping', (_req: Request, res: Response) => {
  return res.success();
});

router.get('/verify-email', Wrap(authController.VerifyEmail));

router.post('/sign-up', Wrap(authController.Signup));
router.post('/sign-in', Wrap(authController.SignIn));

export const authRouter = router;
