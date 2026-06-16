import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all client origins
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Base route for check
app.get('/', (req, res) => {
  res.json({ message: 'Seetharamapuram Digital Village Platform API is running.' });
});

// Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
