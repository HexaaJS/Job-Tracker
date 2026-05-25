import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getStats,
} from '../controllers/ApplicationController';

const router: Router = Router();

// ⚠️ /stats AVANT /:id — sinon Express croit que "stats" est un id MongoDB
router.get('/stats', getStats);

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;