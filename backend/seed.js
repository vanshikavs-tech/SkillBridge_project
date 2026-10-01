const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { seedAllData } = require('./services/autoSeedService');

/**
 * SkillBridge Database Seeder
 * Populates clean, realistic data with pre-configured Client, Freelancer, and Admin accounts.
 */
const seedDatabase = async () => {
  try {
    await connectDB();
    await seedAllData(true);

    console.log('===========================================================');
    console.log('✅ SkillBridge Database Seeding Complete!');
    console.log('-----------------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('👤 Client:     client@skillbridge.com     / password123');
    console.log('👩💻 Freelancer: freelancer@skillbridge.com / password123');
    console.log('🛡️ Admin:      admin@skillbridge.com      / password123');
    console.log('===========================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
