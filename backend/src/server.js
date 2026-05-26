const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/jobRoutes'); // Imported our routes

dotenv.config();

const app = express();

// Middleware
// CORS allows your Next.js app on port 3000 to securely connect to this server on port 5000
app.use(cors()); 
app.use(express.json());

// Mount API Routes
// Fixed: Changed from '/api/jobs' to '/jobs' to perfectly align with your frontend fetch requests
app.use('/jobs', jobRoutes); 

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: "The backend is alive and running smoothly!" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and spin up the server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🎉 Successfully connected to MongoDB Atlas!');
    app.listen(PORT, () => console.log(`🚀 Server is flying on port http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });