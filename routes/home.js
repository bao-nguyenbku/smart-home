import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';
import SettingsController from '../controllers/SettingsController.js';
const router = Router();

router.get('/', HomeController.show);
router.get('/settings', SettingsController.show);
router.get('/rooms', HomeController.getAllRoom);
router.post('/room/add', HomeController.addNewRoom);
router.post('/device/add', HomeController.addNewDevice);

export default router;