const express = require('express');
const Ticket = require('../models/Ticket');
const { protect } = require('../middleware/authMiddleware');
const axios = require('axios');

const router = express.Router();

// Create Ticket & Call n8n Workflow
router.post('/', protect, async (req, res) => {
    try {
        const ticket = await Ticket.create({
            title: req.body.title,
            customerId: req.user.customerId,
            createdBy: req.user.id,
        });

        // Trigger n8n workflow
       await axios.post('http://flowbit-n8n:5678/webhook/flowbit', {
            ticketId: ticket._id,
            customerId: ticket.customerId
        });

        res.status(201).json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List Tickets for Logged-in Tenant
router.get('/', protect, async (req, res) => {
    try {
        const tickets = await Ticket.find({ customerId: req.user.customerId });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Webhook to mark ticket done (Secret Header Protected)
router.post('/webhook/ticket-done', async (req, res) => {
    const sharedSecret = req.headers['x-shared-secret'];

    if (sharedSecret !== 'your-n8n-secret') {
        return res.status(401).json({ message: 'Invalid Secret' });
    }

    try {
        const ticketId = req.body.ticketId;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.status = 'done';
        await ticket.save();

        res.json({ message: 'Ticket updated to done' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
