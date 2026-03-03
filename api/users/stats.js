const { User, Document } = require('../../Backend/models');
const { getDatabase } = require('../../lib/db');
const { authenticateToken } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  // Initialize database
  await getDatabase();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { user, error, statusCode } = await authenticateToken(req);

    if (error) {
      return res.status(statusCode).json({
        success: false,
        message: error
      });
    }

    // Get document counts
    const totalDocuments = await Document.count({
      where: { userId: user.id }
    });

    const publicDocuments = await Document.count({
      where: { userId: user.id, isPublic: true }
    });

    const privateDocuments = totalDocuments - publicDocuments;

    // Get total word count across all documents
    const documents = await Document.findAll({
      where: { userId: user.id },
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
};
