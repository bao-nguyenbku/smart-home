import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';
const router = Router();

router.get('/', HomeController.show);
router.post('/room/add', HomeController.addNewRoom);

export default router;