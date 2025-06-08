import dotenv from 'dotenv';
import { testDatabaseConnection, disconnectDatabase } from '../config/database';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🔍 Testing database connection...');
  console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  const isConnected = await testDatabaseConnection();
  
  if (isConnected) {
    console.log('🎉 Database setup is working correctly!');
  } else {
    console.log('❌ Database setup needs attention');
    console.log('\n📝 Next steps:');
    console.log('1. Ensure PostgreSQL is running');
    console.log('2. Create a .env file with DATABASE_URL');
    console.log('3. Run: npm run db:migrate');
  }
  
  await disconnectDatabase();
  process.exit(isConnected ? 0 : 1);
}

main().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
