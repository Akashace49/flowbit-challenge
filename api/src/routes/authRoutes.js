const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, customerId: user.customerId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// Register
router.post('/register', async (req, res) => {
    const { email, password, role, customerId } = req.body;
    try {
        const user = await User.create({ email, password, role, customerId });
        res.status(201).json({ token: generateToken(user) });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ token: generateToken(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
