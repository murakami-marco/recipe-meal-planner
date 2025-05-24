const express = require('express');
const cors = require('cors');
const { db, waitForDbInit } = require('./backend/database');
const indexRouter = require('./backend/routes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Recipe and Meal Planner API' });
});

// API Routes
app.use('/api', indexRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

async function startServer() {
  try {
    await waitForDbInit();
    console.log('Database initialized successfully');

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${PORT} is already in use. Please stop other processes using this port.`
        );
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });

    return server;
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}
module.exports = { app, startServer };
