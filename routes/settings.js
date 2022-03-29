import { Router } from 'express';
import SettingsController from '../controllers/SettingsController.js';
const router = Router();

router.get('/', SettingsController.show);

export default router;