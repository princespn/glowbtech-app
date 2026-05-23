import express from 'express';
import { register, login, oauth, getMe, logout } from '../controllers/AuthController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.post('/register', register); 
router.post('/login', login);
router.post('/oauth', oauth);

router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;