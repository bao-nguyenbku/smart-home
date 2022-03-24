import { Router } from 'express';
import HomeController from '../controllers/HomeController.js';
const router = Router();

router.get('/send', HomeController.show) ;

export default router;