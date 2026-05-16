const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest'); // Import the schema we just made

// 1. GET /api/jobs - List all jobs (Supports category and status filters)
router.get('/', async (req, res, next) => {
  try {
    const { category, status } = req.query;
    let filter = {};
    
    // Check if the frontend asked for specific category or status query filters
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Fetch jobs matching the filters, sorting newest first
    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    next(error); // Passes unexpected errors to our global error handler
  }
});

// 2. GET /api/jobs/:id - Fetch details for a single job
router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job request not found' });
    }
    return res.status(200).json(job);
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/jobs - Create a brand new job post
router.post('/', async (req, res, next) => {
  try {
    const newJob = new JobRequest(req.body);
    const savedJob = await newJob.save();
    return res.status(201).json(savedJob);
  } catch (error) {
    // If Mongoose validation flags a missing field or wrong email formatting
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// 4. PATCH /api/jobs/:id - Update job status field only
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    
    // Ensure status matches the allowed options
    if (!status || !['Open', 'In Progress', 'Closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status value' });
    }

    const updatedJob = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true } // "new" returns the updated document back to us
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job request not found' });
    }
    return res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /api/jobs/:id - Remove a job record entirely
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedJob = await JobRequest.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job request not found' });
    }
    return res.status(200).json({ message: 'Job request successfully removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;