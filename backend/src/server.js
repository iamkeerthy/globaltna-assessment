const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/jobRoutes'); // imported our routes

dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Mount API Routes
app.use('/api/jobs', jobRoutes); // added this line

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

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('🎉 Successfully connected to MongoDB Atlas!');
    app.listen(PORT, () => console.log(`🚀 Server is flying on port http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });