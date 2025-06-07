import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { testDatabaseConnection, disconnectDatabase } from '../config/database';
import { checkDatabaseHealth } from '../utils/database';

// Load environment variables
dotenv.config();

async function runCommand(command: string, description: string): Promise<boolean> {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up VibeCoder database...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('📝 Please create a .env file with your database connection string');
    console.log('Example: DATABASE_URL="postgresql://username:password@localhost:5432/vibecoder_dev"');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`📊 Database URL: ${process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@')}`);

  // Test database connection
  console.log('\n🔍 Testing database connection...');
  const isConnected = await testDatabaseConnection();
  
  if (!isConnected) {
    console.log('\n❌ Cannot connect to database. Please ensure:');
    console.log('1. PostgreSQL server is running');
    console.log('2. Database credentials are correct');
    console.log('3. Database exists or user has permission to create it');
    await disconnectDatabase();
    process.exit(1);
  }

  // Generate Prisma client
  console.log('\n📦 Generating Prisma client...');
  const clientGenerated = await runCommand('npx prisma generate', 'Prisma client generation');
  if (!clientGenerated) {
    await disconnectDatabase();
    process.exit(1);
  }

  // Run database migrations
  console.log('\n🔄 Running database migrations...');
  const migrationsRun = await runCommand('npx prisma migrate dev --name init', 'Database migrations');
  if (!migrationsRun) {
    await disconnectDatabase();
    process.exit(1);
  }

  // Seed the database
  console.log('\n🌱 Seeding database with sample data...');
  const seedingCompleted = await runCommand('npm run db:seed', 'Database seeding');
  if (!seedingCompleted) {
    console.log('⚠️ Seeding failed, but database setup is complete');
  }

  // Final health check
  console.log('\n🏥 Performing final health check...');
  const healthCheck = await checkDatabaseHealth();
  
  if (healthCheck.status === 'healthy') {
    console.log('✅ Database health check passed');
    if (healthCheck.stats) {
      console.log('\n📊 Database Statistics:');
      console.log(`   Users: ${healthCheck.stats.users}`);
      console.log(`   Projects: ${healthCheck.stats.projects}`);
      console.log(`   Transactions: ${healthCheck.stats.transactions}`);
      console.log(`   Reviews: ${healthCheck.stats.reviews}`);
      console.log(`   Moderation Logs: ${healthCheck.stats.moderationLogs}`);
    }
  } else {
    console.log('❌ Database health check failed:', healthCheck.message);
  }

  await disconnectDatabase();

  console.log('\n🎉 Database setup completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Open Prisma Studio: npm run db:studio');
  console.log('3. View API documentation at: http://localhost:5000/api/docs');
}

main().catch((error) => {
  console.error('❌ Database setup failed:', error);
  process.exit(1);
});
