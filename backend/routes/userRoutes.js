import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Middleware to protect routes
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
      req.user = decoded; 
      next();
    } catch (error) {
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
