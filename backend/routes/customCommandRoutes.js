// backend/routes/customCommandRoutes.js

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

// Import Middleware
const { isAuthenticated } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Import Controller Functions
const customCommandController = require('../controllers/customCommandController');

// Apply middlewares
router.use(isAuthenticated);
router.use(isAdmin);

// POST /api/admins/custom-commands - Create a new custom command
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('code').notEmpty().withMessage('Code is required.'),
    body('featureId').isInt().withMessage('Feature ID must be an integer.'),
  ],
  customCommandController.createCustomCommand
);

// GET /api/admins/custom-commands - Fetch all custom commands
router.get('/', customCommandController.getAllCustomCommands);

// PUT /api/admins/custom-commands/:id - Update a custom command
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Command ID must be an integer.'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty.'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty.'),
    body('code').optional().notEmpty().withMessage('Code cannot be empty.'),
    body('featureId').optional().isInt().withMessage('Feature ID must be an integer.'),
    body('enabled').optional().isBoolean().withMessage('Enabled must be a boolean.'),
  ],
  customCommandController.updateCustomCommand
);

// DELETE /api/admins/custom-commands/:id - Delete a custom command
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('Command ID must be an integer.'),
  ],
  customCommandController.deleteCustomCommand
);

module.exports = router;
