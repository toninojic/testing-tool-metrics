const { mongoClient, enviromentVar } = require('../serverConfig');

class MongoService {

    /**
     * Increment metric for variation in MongoDB.
     *
     * @param {string} clientName - The name of the client (and collection).
     * @param {string} testId - The unique identifier of the test.
     * @param {string} variationName - Variation
     * @param {integer} count - Counter for variation
     * @returns {Promise<void>} - Returns a promise that resolves when the update is complete.
     */
    static async incrementVariation(clientName, testID, variationName, count = 1) {
        try {
            const db = mongoClient.db('TestingToolMetrics').collection(clientName);

            const field = `tests.${testID}.variationCount.${variationName}`;
            
            const result = await db.updateOne(
                { clientName },
                { $inc: { [field]: count } },
                { upsert: true }
            );

            if (enviromentVar === 'develop') {
                console.log(`Incremented ${clientName} - ${testID} - ${variationName} by ${count}`);
            }
        } catch (error) {
            if (enviromentVar === 'develop') {
                console.error(`Mongo incrementVariation error:`, error);
            }
        }
    }

    /**
     * Gets variation metrics for particular client
     * 
     * @param {string} clientName - The name of the client (and collection).
     *
     * @returns {Promise<Object>}
     */
    static async getClientMetrics(clientName) {
        try {
            const db = mongoClient.db('TestingToolMetrics').collection(clientName);
            return await db.findOne({ clientName });
        } catch (error) {
            if (enviromentVar === 'develop') {
                console.error(`Mongo getClientMetrics error:`, error);
            }
            return null;
        }
    }
}

module.exports = { MongoService };
