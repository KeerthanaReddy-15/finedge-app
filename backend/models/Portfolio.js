import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assetSymbol: {
    type: String,
    required: true, // e.g. BTC, ETH, AAPL
  },
  assetType: {
    type: String,
    enum: ['crypto', 'stock'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  averageEntryPrice: {
    type: Number,
    required: true,
    default: 0,
  }
}, { timestamps: true });

// Ensure a user only has one portfolio entry per asset symbol
portfolioSchema.index({ userId: 1, assetSymbol: 1 }, { unique: true });

export default mongoose.model('Portfolio', portfolioSchema);
