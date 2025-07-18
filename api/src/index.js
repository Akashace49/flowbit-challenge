require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Example Public Route
app.get('/', (req, res) => {
    res.send('Flowbit API Running ✅');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`API Running at http://localhost:${PORT}`);
});


const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);


const screensRoutes = require('./routes/screensRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api', screensRoutes);
app.use('/api', adminRoutes);

const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api/tickets', ticketRoutes);


