const router = require('express').Router();
const { RedisService } = require('../util/RedisService');

/**
 * POST /track
 * Update metric inside Redis
 */
router.post('/track', async (req, res) => {
    const { clientName, testID, variation } = req.body;

    if (!clientName || !testID || !variation) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    await RedisService.incrementTestView(clientName, testID, variation);

    res.status(200).json({ message: 'Metric tracked in Redis' });
});

module.exports = router;
