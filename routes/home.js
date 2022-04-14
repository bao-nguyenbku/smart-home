import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';
import SettingsController from '../controllers/SettingsController.js';
import isLoggedIn from '../controllers/isLoggedIn.js';
const router = Router();

router.get('/room/all', isLoggedIn(), HomeController.getAllRoom);
router.post('/room/add', isLoggedIn(), HomeController.addNewRoom);
router.post('/room/delete', isLoggedIn(), HomeController.deleteRoom);



router.get('/device/all', isLoggedIn(), HomeController.getAllDevice);
router.post('/device/add', isLoggedIn(), HomeController.addNewDevice);
router.get('/settings', isLoggedIn(), SettingsController.show);
router.post('/device/toggle', isLoggedIn(), HomeController.toggleDevice);

export default router;