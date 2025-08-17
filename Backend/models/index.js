const User = require('./Users');
const Document = require('./Document');
const DocumentVersion = require('./DocumentVersion');

// Define associations
User.hasMany(Document, {
  foreignKey: 'user_id',
  as: 'documents'
});

Document.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author'
});

Document.hasMany(DocumentVersion, {
  foreignKey: 'document_id',
  as: 'versions'
});

DocumentVersion.belongsTo(Document, {
  foreignKey: 'document_id',
  as: 'document'
});

DocumentVersion.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'author'
});

User.hasMany(DocumentVersion, {
  foreignKey: 'created_by',
  as: 'documentVersions'
});

module.exports = {
  User,
  Document,
  DocumentVersion
};