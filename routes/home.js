import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';

const router = Router();

router.get('/room/all', HomeController.getAllRoom);
router.post('/room/add', HomeController.addNewRoom);
router.post('/room/device/all', HomeController.getDeviceByRoomId);


router.get('/device/all', HomeController.getAllDevice);
router.post('/device/add', HomeController.addNewDevice);
router.post('/device/edit', HomeController.editDeviceName);
router.post('/device/delete', HomeController.deleteDevice);
router.post('/device/toggle', HomeController.toggleDevice);

router.get('/port', HomeController.getPorts);
export default router;