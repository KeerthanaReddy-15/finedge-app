import express from 'express';
import { 
  register, login, setup2FA, verify2FASetup, 
  verify2FALogin, forgotPassword, resetPassword, changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Authenticated Password Change
router.post('/change-password', protect, changePassword);

// 2FA Routes (Protected by either full access token or 2fa_pending token)
router.post('/2fa/setup', protect, setup2FA);
router.post('/2fa/verify-setup', protect, verify2FASetup);
router.post('/2fa/verify-login', protect, verify2FALogin);

export default router;
