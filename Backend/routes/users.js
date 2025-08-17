const express = require('express');
const { query, validationResult } = require('express-validator');
const { User, Document } = require('../models');
const { Op } = require('sequelize'); // Added missing import
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get document counts
    const totalDocuments = await Document.count({
      where: { userId }
    });

    const publicDocuments = await Document.count({
      where: { userId, isPublic: true }
    });

    const privateDocuments = totalDocuments - publicDocuments;

    // Get total word count across all documents
    const documents = await Document.findAll({
      where: { userId },
      attributes: ['metadata']
    });

    const totalWords = documents.reduce((sum, doc) => {
      return sum + (doc.metadata?.wordCount || 0);
    }, 0);

    const totalCharacters = documents.reduce((sum, doc) => {
      return sum + (doc.metadata?.characterCount || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        totalDocuments,
        publicDocuments,
        privateDocuments,
        totalWords,
        totalCharacters
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// Search users (for collaboration features)
router.get('/search', authenticateToken, [
  query('q')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Search query must be between 2 and 50 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q: query, limit = 10 } = req.query;

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } }
        ],
        isActive: true,
        id: { [Op.ne]: req.user.id } // Exclude current user
      },
      attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
});

module.exports = router;