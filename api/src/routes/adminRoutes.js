const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin/secret', protect, adminOnly, (req, res) => {
    res.json({ message: `Hello Admin from ${req.user.customerId}` });
});

module.exports = router;
