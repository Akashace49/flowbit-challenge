const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const registry = require('../registry.json');

const router = express.Router();

router.get('/me/screens', protect, (req, res) => {
    const tenantScreens = registry.find(
        (entry) => entry.customerId === req.user.customerId
    );

    res.json(tenantScreens ? tenantScreens.screens : []);
});

module.exports = router;
