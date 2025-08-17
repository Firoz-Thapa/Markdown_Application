const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DocumentVersion = sequelize.define('DocumentVersion', {
  id: {
    type: DataTypes.STRING, // Changed from UUID to STRING for SQLite
    defaultValue: () => require('uuid').v4(), // Generate UUID as string
    primaryKey: true
  },
  documentId: {
    type: DataTypes.STRING, // Changed from UUID to STRING
    allowNull: false,
    field: 'document_id',
    references: {
      model: 'documents',
      key: 'id'
    }
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  changeLog: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'change_log'
  },
  createdBy: {
    type: DataTypes.STRING, // Changed from UUID to STRING
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'document_versions',
  updatedAt: false // Only track creation time for versions
});

module.exports = DocumentVersion;