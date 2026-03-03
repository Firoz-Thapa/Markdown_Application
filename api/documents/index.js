const { Document, DocumentVersion, User } = require('../../Backend/models');
const { Op } = require('sequelize');
const { getDatabase } = require('../../lib/db');
const { authenticateToken } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  // Initialize database
  await getDatabase();

  if (req.method === 'GET') {
    try {
      const { user, error, statusCode } = await authenticateToken(req);

      if (error) {
        return res.status(statusCode).json({
          success: false,
          message: error
        });
      }

      const { page = 1, limit = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = req.query;
      const offset = (page - 1) * limit;
      const whereClause = { userId: user.id };

      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows: documents } = await Document.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          documents,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch documents'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { user, error, statusCode } = await authenticateToken(req);

      if (error) {
        return res.status(statusCode).json({
          success: false,
          message: error
        });
      }

      const { title, content, isPublic, tags } = req.body;

      const document = await Document.create({
        title: title || 'Untitled Document',
        content: content || '',
        isPublic: isPublic || false,
        tags: tags || [],
        userId: user.id
      });

      // Create initial version
      await DocumentVersion.create({
        documentId: document.id,
        version: 1,
        title: document.title,
        content: document.content,
        changeLog: 'Initial version',
        createdBy: user.id
      });

      res.status(201).json({
        success: true,
        message: 'Document created successfully',
        data: { document }
      });
    } catch (error) {
      console.error('Create document error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create document'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
