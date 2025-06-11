import { PrismaClient, UserRole, ProjectStatus, LicenseType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vibecodeseller.com' },
    update: {},
    create: {
      email: 'admin@vibecodeseller.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample sellers
  const sellerPassword = await bcrypt.hash('seller123', 12);
  const seller1 = await prisma.user.upsert({
    where: { email: 'seller1@example.com' },
    update: {},
    create: {
      email: 'seller1@example.com',
      password: sellerPassword,
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: UserRole.SELLER,
      bio: 'Full-stack developer with 5+ years of experience in React and Node.js',
      isVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@example.com' },
    update: {},
    create: {
      email: 'seller2@example.com',
      password: sellerPassword,
      firstName: 'Priya',
      lastName: 'Patel',
      role: UserRole.SELLER,
      bio: 'Mobile app developer specializing in React Native and Flutter',
      isVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Seller users created');

  // Create sample buyers
  const buyerPassword = await bcrypt.hash('buyer123', 12);
  const buyer1 = await prisma.user.upsert({
    where: { email: 'buyer1@example.com' },
    update: {},
    create: {
      email: 'buyer1@example.com',
      password: buyerPassword,
      firstName: 'Amit',
      lastName: 'Kumar',
      role: UserRole.BUYER,
      isVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const buyer2 = await prisma.user.upsert({
    where: { email: 'buyer2@example.com' },
    update: {},
    create: {
      email: 'buyer2@example.com',
      password: buyerPassword,
      firstName: 'Sneha',
      lastName: 'Singh',
      role: UserRole.BUYER,
      isVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  console.log('✅ Buyer users created');

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      title: 'E-commerce React Dashboard',
      description: 'A complete e-commerce admin dashboard built with React, TypeScript, and Material-UI. Features include product management, order tracking, analytics, and user management.',
      shortDescription: 'Modern e-commerce admin dashboard with React and TypeScript',
      techStack: ['React', 'TypeScript', 'Material-UI', 'Redux', 'Chart.js'],
      category: 'Web Development',
      tags: ['react', 'typescript', 'dashboard', 'ecommerce', 'admin'],
      price: 2999.00,
      licenseType: LicenseType.SINGLE,
      status: ProjectStatus.APPROVED,
      slug: 'ecommerce-react-dashboard',
      sellerId: seller1.id,
      publishedAt: new Date(),
      screenshots: ['screenshot1.jpg', 'screenshot2.jpg', 'screenshot3.jpg'],
      demoUrl: 'https://demo.example.com/ecommerce-dashboard',
      rating: 4.5,
      reviewCount: 12,
      downloadCount: 45,
      viewCount: 234,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'React Native Food Delivery App',
      description: 'Complete food delivery mobile application built with React Native. Includes user authentication, restaurant listings, cart management, order tracking, and payment integration.',
      shortDescription: 'Full-featured food delivery app for iOS and Android',
      techStack: ['React Native', 'TypeScript', 'Firebase', 'Stripe', 'Google Maps'],
      category: 'Mobile Development',
      tags: ['react-native', 'mobile', 'food-delivery', 'firebase', 'stripe'],
      price: 4999.00,
      licenseType: LicenseType.MULTI,
      status: ProjectStatus.APPROVED,
      slug: 'react-native-food-delivery',
      sellerId: seller2.id,
      publishedAt: new Date(),
      screenshots: ['mobile1.jpg', 'mobile2.jpg', 'mobile3.jpg'],
      githubUrl: 'https://github.com/example/food-delivery-app',
      rating: 4.8,
      reviewCount: 8,
      downloadCount: 23,
      viewCount: 156,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Node.js REST API Boilerplate',
      description: 'Production-ready Node.js REST API boilerplate with Express, TypeScript, Prisma, JWT authentication, rate limiting, and comprehensive testing setup.',
      shortDescription: 'Production-ready Node.js API boilerplate with best practices',
      techStack: ['Node.js', 'Express', 'TypeScript', 'Prisma', 'Jest', 'PostgreSQL'],
      category: 'Backend Development',
      tags: ['nodejs', 'api', 'boilerplate', 'typescript', 'prisma'],
      price: 1999.00,
      licenseType: LicenseType.COMMERCIAL,
      status: ProjectStatus.APPROVED,
      slug: 'nodejs-api-boilerplate',
      sellerId: seller1.id,
      publishedAt: new Date(),
      screenshots: ['api1.jpg', 'api2.jpg'],
      githubUrl: 'https://github.com/example/nodejs-api-boilerplate',
      rating: 4.2,
      reviewCount: 15,
      downloadCount: 67,
      viewCount: 345,
    },
  });

  console.log('✅ Sample projects created');

  // Create sample reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent dashboard! Clean code and great documentation. Saved me weeks of development time.',
      userId: buyer1.id,
      projectId: project1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Good quality code, but could use more customization options.',
      userId: buyer2.id,
      projectId: project1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Amazing food delivery app! Works perfectly on both iOS and Android.',
      userId: buyer1.id,
      projectId: project2.id,
    },
  });

  console.log('✅ Sample reviews created');

  // Create sample moderation logs
  await prisma.moderationLog.create({
    data: {
      action: 'APPROVED',
      reason: 'Code quality check passed',
      notes: 'Project meets all quality standards',
      moderatorId: admin.id,
      projectId: project1.id,
    },
  });

  await prisma.moderationLog.create({
    data: {
      action: 'APPROVED',
      reason: 'Code quality check passed',
      notes: 'Excellent mobile app with good documentation',
      moderatorId: admin.id,
      projectId: project2.id,
    },
  });

  console.log('✅ Sample moderation logs created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Projects: ${await prisma.project.count()}`);
  console.log(`- Reviews: ${await prisma.review.count()}`);
  console.log(`- Moderation Logs: ${await prisma.moderationLog.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
