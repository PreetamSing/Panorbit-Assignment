import { Router } from 'express';
import { authRouter } from '@modules/auth/routes';
import { dashboardRouter } from '@modules/dashboard/routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/dashboard', dashboardRouter);

export const AppRoutes = router;
