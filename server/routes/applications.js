const express = require('express');
const { body } = require('express-validator');
const {
  getApplications,
  getStats,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const applicationValidation = [
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  body('role')
    .trim()
    .notEmpty().withMessage('Job role is required')
    .isLength({ max: 100 }).withMessage('Role cannot exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['Applied', 'Interview', 'Offer', 'Rejected'])
    .withMessage('Status must be one of: Applied, Interview, Offer, Rejected'),
  body('jobLink')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Please provide a valid URL for the job link'),
  body('appliedDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Please provide a valid date'),
  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
];

const updateValidation = [
  body('company')
    .optional()
    .trim()
    .notEmpty().withMessage('Company name cannot be empty')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  body('role')
    .optional()
    .trim()
    .notEmpty().withMessage('Role cannot be empty')
    .isLength({ max: 100 }).withMessage('Role cannot exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['Applied', 'Interview', 'Offer', 'Rejected'])
    .withMessage('Status must be one of: Applied, Interview, Offer, Rejected'),
  body('jobLink')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Please provide a valid URL for the job link'),
  body('appliedDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Please provide a valid date'),
  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
];

// Stats route must be before /:id to avoid being matched as an id
router.get('/stats', getStats);

router.route('/')
  .get(getApplications)
  .post(applicationValidation, createApplication);

router.route('/:id')
  .get(getApplication)
  .put(updateValidation, updateApplication)
  .delete(deleteApplication);

module.exports = router;
