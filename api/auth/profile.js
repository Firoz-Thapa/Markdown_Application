const { getDatabase } = require('../../lib/db');
const { authenticateToken } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  // Initialize database
  await getDatabase();

  if (req.method === 'PUT') {
    try {
      const { user, error, statusCode } = await authenticateToken(req);

      if (error) {
        return res.status(statusCode).json({
          success: false,
          message: error
        });
      }

      const { firstName, lastName, preferences } = req.body;
      const updateData = {};

      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (preferences !== undefined) {
        updateData.preferences = {
          ...user.preferences,
          ...preferences
        };
      }

      await user.update(updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
