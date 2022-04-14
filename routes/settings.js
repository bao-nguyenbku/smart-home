import { Router } from 'express';
import SettingsController from '../controllers/SettingsController.js';
import isLoggedIn from '../controllers/isLoggedIn.js';
const router = Router();

router.get('/', isLoggedIn(), SettingsController.show);
router.get('/OffEnergy', isLoggedIn(), SettingsController.show);

export default router;