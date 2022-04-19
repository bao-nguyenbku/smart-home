import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';
import SettingsController from '../controllers/SettingsController.js';
import isLoggedIn from '../controllers/isLoggedIn.js';
const router = Router();

router.get('/', isLoggedIn(), HomeController.show);
router.get('/settings', isLoggedIn(), SettingsController.show);
router.post('/room/add', isLoggedIn(), HomeController.addNewRoom);
router.get('/find-new-device', isLoggedIn(), HomeController.getNewDevice);



router.post('/device/add', isLoggedIn(), HomeController.addNewDevice);
router.post('/device/delete', isLoggedIn(), HomeController.deleteDevice);
router.post('/device/toggle', isLoggedIn(), HomeController.toggleDevice);

export default router;