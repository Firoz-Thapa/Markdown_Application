const { DocumentVersion, User } = require('../../../Backend/models');
const { getDatabase } = require('../../../lib/db');
const { authenticateToken } = require('../../../lib/auth');

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

    const { id } = req.query;

    const versions = await DocumentVersion.findAll({
      where: { documentId: id },
      order: [['version', 'DESC']],
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
      data: { versions }
    });
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document versions'
    });
  }
};
