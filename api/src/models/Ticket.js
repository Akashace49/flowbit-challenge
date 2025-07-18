const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    status: { type: String, default: 'open' }, // open, done, etc.
    customerId: { type: String, required: true }, // Tenant ID
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
