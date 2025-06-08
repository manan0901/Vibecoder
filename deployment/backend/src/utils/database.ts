import prisma from '../config/database';

export interface DatabaseStats {
  users: number;
  projects: number;
  transactions: number;
  reviews: number;
  moderationLogs: number;
}

export async function getDatabaseStats(): Promise<DatabaseStats> {
  try {
    const [users, projects, transactions, reviews, moderationLogs] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.transaction.count(),
      prisma.review.count(),
      prisma.moderationLog.count(),
    ]);

    return {
      users,
      projects,
      transactions,
      reviews,
      moderationLogs,
    };
  } catch (error) {
    console.error('Error fetching database stats:', error);
    throw error;
  }
}

export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  stats?: DatabaseStats;
}> {
  try {
    // Test basic connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get database stats
    const stats = await getDatabaseStats();
    
    return {
      status: 'healthy',
      message: 'Database is healthy and responsive',
      stats,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function resetDatabase(): Promise<void> {
  try {
    console.log('🗑️ Clearing database...');
    
    // Delete in correct order to respect foreign key constraints
    await prisma.moderationLog.deleteMany();
    await prisma.review.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}
