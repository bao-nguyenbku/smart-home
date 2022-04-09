import { Router } from 'express';
import StatisticsController from '../controllers/StatisticsController.js';
const router = Router();

router.get('/', StatisticsController.show);
router.get('/devices', StatisticsController.getAllDevice);

export default router;