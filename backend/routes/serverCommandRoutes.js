// backend/routes/serverCommandRoutes.js

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Import Middleware
const { isAuthenticated, ownsServer } = require('../middleware/auth');

// Import Controller Functions
const { getServerCommands, updateServerCommand } = require('../controllers/serverCommandController');

// GET /servers/:serverId/commands
router.get('/:serverId/commands', isAuthenticated, ownsServer, getServerCommands);

// PUT /servers/:serverId/commands/:commandId
router.put(
  '/:serverId/commands/:commandId',
  isAuthenticated,
  ownsServer,
  [
    body('enabled')
      .isBoolean()
      .withMessage("'enabled' must be a boolean."),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateServerCommand
);

module.exports = router;
