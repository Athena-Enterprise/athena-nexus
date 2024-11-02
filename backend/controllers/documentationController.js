// backend/controllers/documentationController.js

const { Documentation, User } = require('../models');
const { Op } = require('sequelize'); // Import Sequelize operators

exports.getAllDocuments = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`, // Case-insensitive search
      };
    }

    // If the user is admin, they can see all documents
    if (req.user && req.user.isAdmin) {
      // No additional filtering
    } else {
      // Non-admins can only see public documents
      whereClause.isPublic = true;
    }

    const documents = await Documentation.findAll({
      where: whereClause,
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Documentation.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check visibility
    if (!document.isPublic) {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createDocument = async (req, res) => {
  try {
    console.log('Creating document:', req.body);
    const { title, content, isPublic } = req.body;
    const newDocument = await Documentation.create({
      title,
      content,
      authorId: req.user.id,
      isPublic: isPublic || false,
    });
    console.log('Document created:', newDocument);
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const document = await Documentation.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    document.title = title || document.title;
    document.content = content || document.content;
    if (isPublic !== undefined) {
      document.isPublic = isPublic;
    }
    await document.save();
    res.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Documentation.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    await document.destroy();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
