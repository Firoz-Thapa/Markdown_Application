const jwt = require('jsonwebtoken');
const { getDatabase } = require('./db');

async function authenticateToken(req) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return { user: null, error: 'Access token required', statusCode: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDatabase();
    
    // Import models
    const { User } = require('./models');
    
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return { user: null, error: 'Invalid or expired token', statusCode: 401 };
    }

    return { user, error: null, statusCode: null };
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return { user: null, error: 'Invalid token', statusCode: 401 };
    }
    
    if (error.name === 'TokenExpiredError') {
      return { user: null, error: 'Token expired', statusCode: 401 };
    }

    return { user: null, error: 'Authentication error', statusCode: 500 };
  }
}

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

module.exports = { authenticateToken, generateToken };
