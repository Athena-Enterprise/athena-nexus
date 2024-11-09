// backend/routes/featureRoutes.js

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');
const featureController = require('../controllers/featureController');

// Apply authentication and admin middleware
router.use(isAuthenticated);
router.use(isAdmin);

// GET /api/features - Get all features
router.get('/', featureController.getAllFeatures);

// POST /api/features - Create a new feature
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('status').optional().isIn(['development', 'active', 'deprecated']).withMessage('Invalid status.'),
    body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean.'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  featureController.createFeature
);

// PUT /api/features/:id - Update a feature
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Feature ID must be an integer.'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty.'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty.'),
    body('status').optional().isIn(['development', 'active', 'deprecated']).withMessage('Invalid status.'),
    body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean.'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  featureController.updateFeature
);

// DELETE /api/features/:id - Delete a feature
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Feature ID must be an integer.')],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  featureController.deleteFeature
);

module.exports = router;
