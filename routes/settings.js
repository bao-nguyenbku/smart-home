import { Router } from 'express';
import SettingsController from '../controllers/SettingsController.js';
import isLoggedIn from '../controllers/isLoggedIn.js';
const router = Router();

router.get('/', isLoggedIn(), SettingsController.show);
router.get('/offEnergy', isLoggedIn(), SettingsController.offEnergy);
router.post('/updateProfile', isLoggedIn(), SettingsController.updateProfile);
router.post('/changeMyHome', isLoggedIn(), SettingsController.changeMyHome);

export default router;