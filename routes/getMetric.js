const router = require('express').Router();
const { MongoService } = require('../util/MongoService');

/**
 * GET /get-metric?clientName=test
 * Returns metrics for the given clientName
 */
router.get('/get-metric', async (req, res) => {
    const clientName = req.query.clientName;
    const testID = req.query.testID;

    if (!clientName) {
        return res.status(400).json({ message: 'Missing clientName in query params' });
    }

    try {
        const metrics = await MongoService.getClientMetrics(clientName);

        if (!metrics) {
            return res.status(404).json({ message: 'No metrics found for client' });
        }

        if (testID) {
            const testMetrics = metrics.tests?.[testID];
            if (!testMetrics) {
                return res.status(404).json({ message: `No metrics found for testID ${testID}` });
            }

            return res.status(200).json({
                clientName,
                testID,
                metrics: testMetrics
            });
        }

        res.status(200).json({ clientName, tests: metrics.tests });

    } catch (error) {
        console.error(`Error fetching metrics for ${clientName}:`, error);
        res.status(500).json({ message: 'Error fetching metrics' });
    }
});

module.exports = router;
