const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Untitled Document'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_public'
  },
  isTemplate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_template'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {
      wordCount: 0,
      characterCount: 0,
      readingTime: 0
    }
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  lastModified: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_modified'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'documents',
  hooks: {
    beforeSave: (document) => {
      // Update metadata
      const content = document.content || '';
      const words = content.trim() ? content.trim().split(/\s+/).length : 0;
      const characters = content.length;
      const readingTime = Math.ceil(words / 200); // Average 200 words per minute
      
      document.metadata = {
        ...document.metadata,
        wordCount: words,
        characterCount: characters,
        readingTime: readingTime
      };
      
      document.lastModified = new Date();
      
      // Generate slug from title if not provided
      if (!document.slug && document.title) {
        document.slug = document.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

module.exports = Document;