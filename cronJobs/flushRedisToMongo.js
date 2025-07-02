const cron = require('node-cron');
const { RedisService } = require('../util/RedisService');
const { MongoService } = require('../util/MongoService');
const { enviromentVar } = require('../serverConfig');


const flushRedisToMongo = async () => {
    if (enviromentVar === 'develop') {
        console.log("Starting flush from Redis to Mongo...");
    }

    const metrics = await RedisService.getAllCounts();

    for (const { key, count } of metrics) {
        const [clientName, testID, variationName] = key.split(':');

        if (clientName && testID && variationName) {
            await MongoService.incrementVariation(clientName, testID, variationName, count);
            await RedisService.clearKey(key);
        } else {
            if (enviromentVar === 'develop') {
                console.warn(`Invalid Redis key format: ${key}`);
            }
        }
    }

    if (enviromentVar === 'develop') {
        console.log("Flush complete.");
    }
};

const scheduleCronJob = () => {
    // Flush Redis to Mongo every 1 minutes
    // ten seconds */10 * * * * *
    cron.schedule('*/1 * * * *', async () => {
        await flushRedisToMongo();
    });

    if (enviromentVar === 'develop') {
        console.log("Cron jobs scheduled.");
    }
};

module.exports = { scheduleCronJob };
