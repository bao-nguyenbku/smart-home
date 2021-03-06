import { Router } from 'express';
import StatisticsController from '../controllers/StatisticsController.js';
import isLoggedIn from '../controllers/isLoggedIn.js';
const router = Router();

router.get('/', isLoggedIn(), StatisticsController.show);
router.get('/devices', isLoggedIn(), StatisticsController.getAllDevice);
router.get('/data', isLoggedIn(), StatisticsController.getTotalkWhPerDay);

export default router;