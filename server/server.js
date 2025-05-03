const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const socketManager = require('./utils/socketManager');
const connectDB = require('./config/database');

// Import routes
const peerRoutes = require('./routes/peerRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/peers', peerRoutes);
app.use('/api/files', fileRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.send('Secure File Transfer API is running');
});

// Server Setup
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
socketManager.initialize(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 