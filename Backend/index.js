const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Connect to MongoDB
// (Assumes config/db.js handles connection or exports a function to connect)
if (typeof db === 'function') {
  db();
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes);

// Socket.io setup (if needed)
try {
  const { setupTaskSocket } = require('./sockets/taskSocket');
  setupTaskSocket(server);
} catch (e) {
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 