// backend/routes/documentationRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const documentationController = require('../controllers/documentationController');
const isAdmin = require('../middleware/isAdmin'); // Ensure correct middleware path
const { isAuthenticated } = require('../middleware/auth'); // Ensure correct middleware import
const { Documentation, User } = require('../models');

// Public routes (accessible by all authenticated users)
router.get('/public', isAuthenticated, async (req, res) => {
  try {
    const docs = await Documentation.findAll({
      where: { isPublic: true },
      attributes: ['id', 'title', 'summary'],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username'],
        },
      ],
    });
    res.json(docs);
  } catch (error) {
    console.error('Error fetching public documentation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/docs/:id - Fetch a single documentation entry
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const docId = req.params.id;

    // Validate UUID format if Documentation.id is UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(docId);
    if (!isUUID) {
      return res.status(400).json({ error: 'Invalid Documentation ID format.' });
    }

    const doc = await Documentation.findOne({
      where: { id: docId, isPublic: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username'],
        },
      ],
    });

    if (!doc) {
      return res.status(404).json({ error: 'Documentation not found.' });
    }

    res.json(doc);
  } catch (error) {
    console.error('Error fetching documentation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply admin middleware to all routes below
router.use((req, res, next) => {
  isAdmin(req, res, next);
});

// POST /api/docs - Create a new documentation entry
router.post(
  '/',
  [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('content').isString().notEmpty().withMessage('Content is required'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, isPublic } = req.body;
      const authorId = req.user.id; // Assuming the authenticated user is the author

      const newDoc = await Documentation.create({
        title,
        content,
        isPublic: isPublic || false,
        authorId,
      });

      res.status(201).json(newDoc);
    } catch (error) {
      console.error('Error creating documentation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/docs/:id - Update a documentation entry
router.put(
  '/:id',
  [
    body('title').optional().isString().withMessage('Title must be a string'),
    body('content').optional().isString().withMessage('Content must be a string'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { title, content, isPublic } = req.body;

    // Validate UUID format if Documentation.id is UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    if (!isUUID) {
      return res.status(400).json({ error: 'Invalid Documentation ID format.' });
    }

    try {
      const doc = await Documentation.findByPk(id);
      if (!doc) {
        return res.status(404).json({ error: 'Documentation not found' });
      }

      if (title !== undefined) doc.title = title;
      if (content !== undefined) doc.content = content;
      if (isPublic !== undefined) doc.isPublic = isPublic;

      await doc.save();

      res.json(doc);
    } catch (error) {
      console.error('Error updating documentation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/docs/:id - Delete a documentation entry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate UUID format if Documentation.id is UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  if (!isUUID) {
    return res.status(400).json({ error: 'Invalid Documentation ID format.' });
  }

  try {
    const doc = await Documentation.findByPk(id);
    if (!doc) {
      return res.status(404).json({ error: 'Documentation not found' });
    }

    await doc.destroy();
    res.json({ message: 'Documentation deleted successfully.' });
  } catch (error) {
    console.error('Error deleting documentation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
