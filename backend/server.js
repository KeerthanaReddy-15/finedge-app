import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import walletRoutes from './routes/walletRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Port
const PORT = process.env.PORT || 5000;

// MongoDB Connection (ONLY from .env / Render)
const MONGO_URI = process.env.MONGO_URI;

// Connect DB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅ - server.js:32');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀 - server.js:35`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error ❌ - server.js:39', err);
  });