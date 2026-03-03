const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize = null;

async function getDatabase() {
  if (sequelize) {
    return sequelize;
  }

  // Use SQLite for development and production
  // For Vercel: use /tmp directory for ephemeral storage, or consider PostgreSQL
  const dbPath = process.env.DATABASE_URL || (
    process.env.VERCEL ? '/tmp/database.sqlite' : './database.sqlite'
  );

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

  try {
    await sequelize.authenticate();
    console.log('Database connection established');
  } catch (error) {
    console.error('Unable to connect to database:', error);
    // Don't throw in serverless - connection might be pooled
  }

  return sequelize;
}

module.exports = { getDatabase };
