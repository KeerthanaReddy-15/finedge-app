import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Critical Fix: Using a consistent secret fallback across all modules
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_finedge_key_123');
            
            req.user = decoded; 
            next();
        } catch (error) {
            console.error("JWT Verification failed:", error.message);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};
