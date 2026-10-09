const { validationResult } = require('express-validator');
const Application = require('../models/Application');

// @desc    Get all applications for logged-in user (with optional filters)
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = { user: req.user._id };

    // Filter by status
    if (status) {
      const validStatuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status filter' });
      }
      filter.status = status;
    }

    // Search by company or role (case-insensitive)
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stats (count per status)
// @route   GET /api/applications/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const stats = await Application.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Format into a clean object with all statuses defaulting to 0
    const formatted = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      total: 0,
    };

    stats.forEach(({ _id, count }) => {
      formatted[_id] = count;
      formatted.total += count;
    });

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { company, role, status, location, jobLink, appliedDate, notes } = req.body;

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      status,
      location,
      jobLink,
      appliedDate,
      notes,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    await application.deleteOne();

    res.status(200).json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getStats,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
};
