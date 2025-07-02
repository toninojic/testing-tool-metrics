const router = require('express').Router();
const { RedisService } = require('../util/RedisService');

/**
 * POST /track
 * Update metric inside Redis
 */
router.post('/track', async (req, res) => {
    const { 
        url: REQUESTED_URL,
        testID, 
        variation 
    } = req.body;

    let clientName;
    try {
        const urlObj = new URL(REQUESTED_URL);
        clientName = urlObj.hostname.split('.')[0];
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL provided' });
    }

    if (!clientName || !testID || !variation) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    await RedisService.incrementTestView(clientName, testID, variation);

    res.status(200).json({ message: 'Metric tracked in Redis' });
});

module.exports = router;
