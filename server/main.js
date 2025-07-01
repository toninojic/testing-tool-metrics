const { app, port, connectToRedis, connectToMongo } = require('../serverConfig');
const trackRoute = require('../routes/track');
const getMetric = require('../routes/getMetric');
const { accessLogger } = require('../util/logger');
const { scheduleCronJob } = require('../cronJobs/flushRedisToMongo');

if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        const referrer = req.get('Referer') || 'No referrer';
        const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
        accessLogger.info(`${req.method} REQUEST FROM XF IP ${clientIP}, URL ${referrer}`);
        next();
    });
}
app.use(getMetric);
app.use(trackRoute);

(async () => {
    await connectToRedis();
    await connectToMongo();

    app.listen(port, () => {
        console.log(`Tracking service running on port ${port}`);
    });
})();

scheduleCronJob();