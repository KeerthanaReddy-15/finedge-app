import express from 'express';
import { getBalance, deposit, transfer, executeTrade, getTransactions, getPortfolio } from '../controllers/walletController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/balance', protect, getBalance);
router.get('/transactions', protect, getTransactions);
router.post('/deposit', protect, deposit);
router.post('/transfer', protect, transfer);
router.post('/trade', protect, executeTrade);
router.get('/portfolio', protect, getPortfolio);

export default router;
