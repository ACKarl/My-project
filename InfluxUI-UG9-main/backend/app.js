// backend/app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

const authRoutes = require('./routes/auth');
const dataSourceRoutes = require('./routes/dataSource');

// Add middleware to parse incoming requests with JSON payloads
app.use(express.json());
app.use(cors());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '..', 'frontend'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Set routes
app.use('/api/auth', authRoutes);
app.use('/api/data-source', dataSourceRoutes);

// Existing routes
app.get('/', (req, res) => {
  res.send('Welcome to the InfluxDB No-Code Solution');
});

// Catch-all route to serve index.html for any undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});