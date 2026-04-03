import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null/undefined values without throwing unique index errors
    trim: true,
  },
  bio: {
    type: String,
    maxLength: 500,
  },
  walletBalance: {
    type: Number,
    default: 12500, // Base starting dummy balance
  },
  // 2FA Fields
  twoFactorSecret: {
    type: String,
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  // Password Reset Fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
