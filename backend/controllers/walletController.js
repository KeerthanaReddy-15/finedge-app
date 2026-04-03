import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Portfolio from '../models/Portfolio.js';

export const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        res.json({ balance: user.walletBalance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deposit = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        user.walletBalance += Number(amount);
        await user.save();
        
        const transaction = new Transaction({
            userId,
            type: 'deposit',
            amount: Number(amount),
            description: `Deposited $${amount}`
        });
        await transaction.save();
        
        res.json({ message: 'Deposit successful', balance: user.walletBalance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const transfer = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { targetEmail, amount } = req.body;
        const transferAmount = Number(amount);

        if (!targetEmail || transferAmount <= 0) {
            return res.status(400).json({ error: "Invalid transfer input" });
        }

        const sender = await User.findById(senderId);
        if (!sender) return res.status(404).json({ error: "Sender not found" });

        if (sender.walletBalance < transferAmount) {
            return res.status(400).json({ error: "Insufficient funds" });
        }

        // Execute Transfer for Sender
        sender.walletBalance -= transferAmount;
        await sender.save();

        // Optional: Look up receiver to give them the money if they exist
        const receiver = await User.findOne({ email: targetEmail.toLowerCase() });
        if (receiver) {
            receiver.walletBalance += transferAmount;
            await receiver.save();
            
            // Record Receiver Transaction
            const txIn = new Transaction({
                userId: receiver._id,
                type: 'transfer_in',
                amount: transferAmount,
                status: 'completed',
                description: `Received from ${sender.username || sender.email}`
            });
            await txIn.save();
        }

        // Record Sender Transaction (Always happens regardless of recipient status)
        const txOut = new Transaction({
            userId: senderId,
            type: 'transfer_out',
            amount: transferAmount,
            status: 'completed',
            description: `Transferred to ${targetEmail}`
        });
        await txOut.save();

        res.json({ 
            message: 'Transfer successful', 
            balance: sender.walletBalance,
            receiverEmail: targetEmail 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Transfer failed due to server error" });
    }
};

export const executeTrade = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount: totalCost, type, assetType, assetSymbol, tradeAmount, description, price } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const cost = Number(totalCost);
        const amountTraded = Number(tradeAmount);
        const currentPrice = Number(price);

        if (type === 'buy') {
            if (user.walletBalance < cost) {
                return res.status(400).json({ error: 'Insufficient funds' });
            }
            
            // Deduct balance
            user.walletBalance -= cost;
            await user.save();
            
            // Add to portfolio
            let portfolioItem = await Portfolio.findOne({ userId, assetSymbol });
            if (portfolioItem) {
                // calculate new average entry price
                const totalValue = (portfolioItem.amount * portfolioItem.averageEntryPrice) + cost;
                const newAmount = portfolioItem.amount + amountTraded;
                portfolioItem.averageEntryPrice = totalValue / newAmount;
                portfolioItem.amount = newAmount;
                await portfolioItem.save();
            } else {
                portfolioItem = new Portfolio({
                    userId,
                    assetSymbol,
                    assetType: assetType || 'crypto',
                    amount: amountTraded,
                    averageEntryPrice: currentPrice
                });
                await portfolioItem.save();
            }
            
            // Record Transaction
            const tx = new Transaction({
                userId,
                type: assetType === 'crypto' ? 'trade_crypto_buy' : 'trade_stock_buy',
                amount: cost,
                description: description || `Bought ${amountTraded} ${assetSymbol}`
            });
            await tx.save();
            
            res.json({ message: 'Trade executed successfully', balance: user.walletBalance });
        } 
        else if (type === 'sell') {
            let portfolioItem = await Portfolio.findOne({ userId, assetSymbol });
            if (!portfolioItem || portfolioItem.amount < amountTraded) {
                return res.status(400).json({ error: 'Insufficient asset balance' });
            }
            
            // Decrease portfolio
            portfolioItem.amount -= amountTraded;
            if (portfolioItem.amount <= 0) {
                await Portfolio.findByIdAndDelete(portfolioItem._id);
            } else {
                await portfolioItem.save();
            }
            
            // Add balance
            user.walletBalance += cost;
            await user.save();
            
            // Record Transaction
            const tx = new Transaction({
                userId,
                type: assetType === 'crypto' ? 'trade_crypto_sell' : 'trade_stock_sell',
                amount: cost,
                description: description || `Sold ${amountTraded} ${assetSymbol}`
            });
            await tx.save();
            
            res.json({ message: 'Trade executed successfully', balance: user.walletBalance });
        } else {
            return res.status(400).json({ error: 'Invalid trade type' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ userId: req.user.id });
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};