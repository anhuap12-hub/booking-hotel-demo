import express from 'express';
import { register, login, getProfile, refreshToken, logout, verifyEmail} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken)
router.get("/verify-email", verifyEmail);
export default router; 