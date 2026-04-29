import os from 'os';

// In-memory data store for real-time metrics
export const metrics = {
    totalRequests: 0,
    activeConnections: 0,
    statusCodes: {
        '2xx': 0,
        '4xx': 0,
        '5xx': 0
    },
    recentRequests: [],
    startTime: Date.now()
};

// Middleware to monitor incoming requests in real-time
export const monitorMiddleware = (req, res, next) => {
    metrics.totalRequests++;
    metrics.activeConnections++;
    
    const start = process.hrtime();

    // Listen for when the response finishes
    res.on('finish', () => {
        metrics.activeConnections--;
        
        // Calculate response time
        const diff = process.hrtime(start);
        const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2); // in milliseconds

        // Track status codes
        if (res.statusCode >= 200 && res.statusCode < 300) metrics.statusCodes['2xx']++;
        else if (res.statusCode >= 400 && res.statusCode < 500) metrics.statusCodes['4xx']++;
        else if (res.statusCode >= 500) metrics.statusCodes['5xx']++;

        // Log recent requests (keep only last 10 for memory safety)
        const logEntry = {
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            timeMs: responseTime,
            timestamp: new Date().toISOString()
        };
        
        metrics.recentRequests.unshift(logEntry);
        if (metrics.recentRequests.length > 10) {
            metrics.recentRequests.pop();
        }

        // Colorized Console Logging for "Terminal Monitoring" feel
        const color = res.statusCode >= 500 ? '\x1b[31m' : res.statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
        console.log(`\x1b[36m[MONITOR]\x1b[0m ${req.method} ${req.originalUrl} ${color}${res.statusCode}\x1b[0m - ${responseTime}ms`);
    });

    next();
};

// Function to pull live system metrics (CPU, RAM, Uptime)
export const getSystemHealth = () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return {
        server: {
            uptimeSeconds: Math.floor((Date.now() - metrics.startTime) / 1000),
            cpuLoadAverage: os.loadavg(), // [1 min, 5 min, 15 min]
            memoryUsage: {
                totalGB: (totalMem / 1024 / 1024 / 1024).toFixed(2),
                usedGB: (usedMem / 1024 / 1024 / 1024).toFixed(2),
                percentage: ((usedMem / totalMem) * 100).toFixed(1) + '%'
            },
            platform: os.platform()
        },
        traffic: {
            totalRequests: metrics.totalRequests,
            activeConnections: metrics.activeConnections,
            statusBreakdown: metrics.statusCodes
        },
        liveFeed: metrics.recentRequests
    };
};
