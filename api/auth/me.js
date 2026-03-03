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

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
};
