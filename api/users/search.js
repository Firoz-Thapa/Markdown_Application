const { User } = require('../../Backend/models');
const { Op } = require('sequelize');
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

    const { q: query, limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } }
        ],
        isActive: true,
        id: { [Op.ne]: user.id }
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
};
