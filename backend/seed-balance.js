import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Portfolio from './models/Portfolio.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finedge';

async function seedBalances() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const users = await User.find();
    if (users.length === 0) {
      console.log('No users found in database.');
      process.exit(0);
    }

    for (let user of users) {
      // 1. Give massive fiat balance
      user.walletBalance = 10000000; // $10 Million
      await user.save();
      console.log(`Updated wallet balance for ${user.email} to $10,000,000`);

      // 2. Give some BTC to sell
      let btc = await Portfolio.findOne({ userId: user._id, assetSymbol: 'BTC' });
      if (!btc) {
        btc = new Portfolio({
          userId: user._id,
          assetSymbol: 'BTC',
          assetType: 'crypto',
          amount: 50,
          averageEntryPrice: 60000
        });
      } else {
        btc.amount += 50;
      }
      await btc.save();

      // 3. Give some ETH to sell
      let eth = await Portfolio.findOne({ userId: user._id, assetSymbol: 'ETH' });
      if (!eth) {
        eth = new Portfolio({
          userId: user._id,
          assetSymbol: 'ETH',
          assetType: 'crypto',
          amount: 500,
          averageEntryPrice: 3000
        });
      } else {
        eth.amount += 500;
      }
      await eth.save();

      console.log(`Added 50 BTC and 500 ETH to portfolio of ${user.email}`);
    }

    console.log('Done!');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding balances:', err);
    process.exit(1);
  }
}

seedBalances();
