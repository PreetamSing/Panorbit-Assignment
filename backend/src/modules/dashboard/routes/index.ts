import { Request, Response, Router } from 'express';
// import DashboardController from '@modules/dashboard/controllers';
import { Wrap } from '@core/utils';

// const dashboardController = new DashboardController();
const router = Router();

router.get('/ping', (_req: Request, res: Response) => {
  return res.success();
});

export const dashboardRouter = router;
