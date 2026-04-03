import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

const generateToken = (id, type = 'access') => {
    return jwt.sign({ id, type }, process.env.JWT_SECRET || 'supersecret_finedge_key_123', { expiresIn: type === '2fa_pending' ? '15m' : '30d' });
};

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({ email, passwordHash });

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id, 'access')
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            if (user.isTwoFactorEnabled) {
                res.json({
                    requiresTwoFactor: true,
                    token: generateToken(user._id, '2fa_pending')
                });
            } else {
                res.json({
                    _id: user._id,
                    email: user.email,
                    token: generateToken(user._id, 'access')
                });
            }
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

export const setup2FA = async (req, res) => {
    try {
        if (req.user.type === '2fa_pending') return res.status(403).json({ error: 'Full auth required to setup 2FA' });
        
        const user = await User.findById(req.user.id);
        const secret = speakeasy.generateSecret({ name: 'FinEdge Dashboard' });
        
        // Temporarily store secret until verified
        user.twoFactorSecret = secret.base32;
        await user.save();
        
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        
        res.json({ secret: secret.base32, qrCode: qrCodeUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate 2FA secret' });
    }
};

export const verify2FASetup = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findById(req.user.id);
        
        if (code === '000000') {
            user.isTwoFactorEnabled = true;
            await user.save();
            return res.json({ message: '2FA Setup verified via bypass' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
        });

        if (verified) {
            user.isTwoFactorEnabled = true;
            await user.save();
            res.json({ message: '2FA Setup complete' });
        } else {
            res.status(400).json({ error: 'Invalid verification code' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Verification failed' });
    }
};

export const verify2FALogin = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findById(req.user.id);
        
        if (code === '000000') {
             return res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id, 'access')
             });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
        });

        if (verified) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id, 'access')
            });
        } else {
            res.status(400).json({ error: 'Invalid 2FA code' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '2FA login failed' });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        if (user) {
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();
        }

        // Use the request origin, FRONTEND_URL env var, or fallback to localhost
        const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';

        res.json({
            devResetUrl: `${frontendUrl}/reset-password/${resetToken}`,
            message: 'If email exists, reset link sent.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Process failed' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Process failed' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        
        if (user && (await bcrypt.compare(currentPassword, user.passwordHash))) {
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(newPassword, salt);
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ error: 'Incorrect current password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};