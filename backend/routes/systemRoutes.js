import express from 'express';
import { getSystemHealth } from '../utils/monitorEngine.js';

const router = express.Router();

// GET /api/system/monitor
// Returns a live snapshot of the server's health, memory, and traffic metrics.
router.get('/monitor', (req, res) => {
    try {
        const liveMetrics = getSystemHealth();
        res.json(liveMetrics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch monitoring metrics' });
    }
});

export default router;
