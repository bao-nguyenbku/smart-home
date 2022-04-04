import { Router } from 'express';
import LoginController from '../controllers/LoginController.js';
const router = Router();

router.get('/', LoginController.show);


export default router;