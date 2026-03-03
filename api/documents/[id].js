const { Document, DocumentVersion, User } = require('../../Backend/models');
const { Op } = require('sequelize');
const { getDatabase } = require('../../lib/db');
const { authenticateToken } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  // Initialize database
  await getDatabase();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { user, error, statusCode } = await authenticateToken(req);
      // Optional auth - allow viewing public documents without auth

      const whereClause = { id };

      if (!user) {
        whereClause.isPublic = true;
      } else {
        whereClause[Op.or] = [
          { userId: user.id },
          { isPublic: true }
        ];
      }

      const document = await Document.findOne({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ]
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      res.json({
        success: true,
        data: { document }
      });
    } catch (error) {
      console.error('Get document error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch document'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { user, error, statusCode } = await authenticateToken(req);

      if (error) {
        return res.status(statusCode).json({
          success: false,
          message: error
        });
      }

      const { title, content, isPublic, tags, createVersion, changeLog } = req.body;

      const document = await Document.findOne({
        where: { id, userId: user.id }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      if (createVersion && (title !== document.title || content !== document.content)) {
        await DocumentVersion.create({
          documentId: document.id,
          version: document.version + 1,
          title: document.title,
          content: document.content,
          changeLog: changeLog || 'Document updated',
          createdBy: user.id
        });

        await document.update({ version: document.version + 1 });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (isPublic !== undefined) updateData.isPublic = isPublic;
      if (tags !== undefined) updateData.tags = tags;

      await document.update(updateData);

      res.json({
        success: true,
        message: 'Document updated successfully',
        data: { document }
      });
    } catch (error) {
      console.error('Update document error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update document'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { user, error, statusCode } = await authenticateToken(req);

      if (error) {
        return res.status(statusCode).json({
          success: false,
          message: error
        });
      }

      const document = await Document.findOne({
        where: { id, userId: user.id }
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      await DocumentVersion.destroy({
        where: { documentId: document.id }
      });

      await document.destroy();

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete document'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
