import mongoose from 'mongoose';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const fundUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB ✅');

        // Find the testing user (the one with $12,501.00 balance from the screenshot)
        const user = await User.findOne({}).sort({ updatedAt: -1 });
        if (!user) {
            console.log('No user found to fund.');
            process.exit(1);
        }

        console.log(`Funding user: ${user.email} (Current Balance: $${user.walletBalance})`);

        // 1. Set massive USD balance
        user.walletBalance = 1000000;
        await user.save();
        console.log('USD Balance updated to $1,000,000 💵');

        // 2. Set massive Crypto and Stock balances
        const assets = [
            { symbol: 'BTC', type: 'crypto', amount: 100, price: 65000 },
            { symbol: 'ETH', type: 'crypto', amount: 1000, price: 3500 },
            { symbol: 'AAPL', type: 'stock', amount: 500, price: 180 },
            { symbol: 'TSLA', type: 'stock', amount: 200, price: 160 },
            { symbol: 'GOLD', type: 'stock', amount: 50, price: 2300 }
        ];

        for (const asset of assets) {
            let portfolioItem = await Portfolio.findOne({ userId: user._id, assetSymbol: asset.symbol });
            if (portfolioItem) {
                portfolioItem.amount = asset.amount;
                portfolioItem.averageEntryPrice = asset.price;
                await portfolioItem.save();
            } else {
                portfolioItem = new Portfolio({
                    userId: user._id,
                    assetSymbol: asset.symbol,
                    assetType: asset.type,
                    amount: asset.amount,
                    averageEntryPrice: asset.price
                });
                await portfolioItem.save();
            }
            console.log(`Added ${asset.amount} ${asset.symbol} to portfolio 🚀`);
        }

        // 3. Add fake Transaction History to make the list look full
        console.log('Adding transaction history...');
        await Transaction.deleteMany({ userId: user._id }); // Clear old ones for clean seed
        
        const txs = [
            { type: 'deposit', amount: 1000000, description: 'Initial Capital Deposit' },
            { type: 'trade_crypto_buy', amount: 65000, description: 'Bought 1 BTC' },
            { type: 'trade_stock_buy', amount: 5000, description: 'Bought 10 AAPL' },
            { type: 'transfer_in', amount: 25000, description: 'Received from FinEdge Rewards' }
        ];

        for (const tx of txs) {
            const newTx = new Transaction({
                userId: user._id,
                ...tx,
                status: 'completed'
            });
            await newTx.save();
        }

        console.log('Account funding and history complete! ✨');
        process.exit(0);
    } catch (error) {
        console.error('Error funding user:', error);
        process.exit(1);
    }
};

import Transaction from '../models/Transaction.js';
fundUser();
