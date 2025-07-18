import axios from 'axios';

export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);

    // ✅ After ticket is saved, do the callback to n8n
    await axios.post('http://flowbit-n8n:5678/webhook/flowbit-callback', {
      message: 'Ticket Created Successfully',
      ticketId: ticket._id,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
