import { Router } from 'express';
import UserController from '../controllers/UserController.js';
const router = Router();

router.get('/', UserController.show);
router.post('/', UserController.login);
router.get('/logout', UserController.logout);
export default router;