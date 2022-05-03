import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';

const router = Router();

router.get('/room/all', HomeController.getAllRoom);
router.post('/room/add', HomeController.addNewRoom);
router.post('/room/device/all', HomeController.getDeviceByRoomId);



router.get('/device/all', HomeController.getAllDevice);
router.get('/adafruit/hardware/all', HomeController.getDataFeed);
router.get('/port', HomeController.getPorts);
router.post('/device/add', HomeController.addNewDevice);
router.post('/device/toggle', HomeController.toggleDevice);
router.post('/device/delete', HomeController.deleteDevice);

export default router;