const cron = require('node-cron');
const { RedisService } = require('../util/RedisService');
const { MongoService } = require('../util/MongoService');

const flushRedisToMongo = async () => {
    console.log("Starting flush from Redis to Mongo...");

    const metrics = await RedisService.getAllCounts();

    for (const { key, count } of metrics) {
        const [clientName, testID, variationName] = key.split(':');

        if (clientName && testID && variationName) {
            await MongoService.incrementVariation(clientName, testID, variationName, count);
            await RedisService.clearKey(key);
        } else {
            console.warn(`Invalid Redis key format: ${key}`);
        }
    }

    console.log("Flush complete.");
};

const scheduleCronJob = () => {
    // Flush Redis to Mongo every 5 minutes
    cron.schedule('*/1 * * * *', async () => {
        await flushRedisToMongo();
    });

    console.log("Cron jobs scheduled.");
};

module.exports = { scheduleCronJob };
