const { sequelize } = require('../config/database');
require('../models'); // This will load all models and associations

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    // Create/update tables
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables created/updated successfully.');
    
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();s