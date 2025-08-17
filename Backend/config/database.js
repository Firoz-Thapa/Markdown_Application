const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for development - much simpler!
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // This will create a file in your Backend folder
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = { sequelize };