const { redisClient, enviromentVar } = require('../serverConfig');

class RedisService {

    /**
     * Increments Redis counter for a specific variation.
     *
     * @param {string} clientName
     * @param {string} testID
     * @param {string} variationName
     * @param {number} count
     */
    static async incrementTestView(clientName, testID, variationName, count = 1) {
        try {
            const key = `${clientName}:${testID}:${variationName}`;
            await redisClient.incrBy(key, count);
            if (enviromentVar === 'develop') {
                console.log(`Redis incremented ${key} by ${count}`);
            }
        } catch (error) {
            if (enviromentVar === 'develop') {
                console.error("Redis incrementTestView error:", error);
            }
        }
    }

    /**
     * Gets all keys and their counts from Redis.
     *
     * @returns {Promise<Array<{key: string, count: number}>>}
     */
    static async getAllCounts() {
        try {
            const keys = await redisClient.keys('*:*:*');
            if (!keys.length) return [];

            const pipeline = redisClient.multi();
            keys.forEach(key => pipeline.get(key));
            const values = await pipeline.exec();

            return keys.map((key, i) => ({
                key,
                count: parseInt(values[i][1], 10) || 0
            }));
        } catch (error) {
            if (enviromentVar === 'develop') {
                console.error("Redis getAllCounts error:", error);
            }
            return [];
        }
    }

    /**
     * Clears a specific Redis key.
     *
     * @param {string} key
     */
    static async clearKey(key) {
        try {
            await redisClient.del(key);
            if (enviromentVar === 'develop') {
                console.log(`Cleared Redis key: ${key}`);
            }
        } catch (error) {
            if (enviromentVar === 'develop') {
                console.error("Redis clearKey error:", error);
            }
        }
    }
}

module.exports = { RedisService };
