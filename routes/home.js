import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';
import SettingsController from '../controllers/SettingsController.js';
import AdaController from '../controllers/AdaController.js';
import isLoggedIn from '../controllers/isLoggedIn.js';
const router = Router();

router.get('/', isLoggedIn(), HomeController.show);
router.get('/adafruit-key', isLoggedIn(), AdaController.getIOKey);
// router.get('/port', isLoggedIn(), HomeController.addPort);
router.get('/settings', isLoggedIn(), SettingsController.show);
router.post('/room/add', isLoggedIn(), HomeController.addNewRoom);
router.get('/find-new-device', isLoggedIn(), HomeController.getNewDevice);



router.post('/device/add', isLoggedIn(), HomeController.addNewDevice);
router.get('/device/all', isLoggedIn(), HomeController.getAllDevice);
router.get('/device/active', isLoggedIn(), HomeController.getAllActiveDevice);
router.post('/device/edit', isLoggedIn(), HomeController.updateDevice);
router.post('/device/delete', isLoggedIn(), HomeController.deleteDevice);
router.post('/device/toggle', isLoggedIn(), HomeController.toggleDevice);


export default router;