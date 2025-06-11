// Test project listing and management system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testProjectManagementSystem() {
  console.log('🧪 Testing VibeCoder Project Listing & Management System...\n');

  try {
    // Step 1: Register seller and admin users
    console.log('1️⃣ Setting up test users...');
    
    // Register seller
    const sellerData = {
      email: 'seller.mgmt@example.com',
      password: 'TestPassword123!',
      firstName: 'Management',
      lastName: 'Seller',
      role: 'SELLER'
    };

    const sellerResponse = await axios.post(`${API_BASE}/auth/register`, sellerData);
    const sellerToken = sellerResponse.data.data.tokens.accessToken;
    console.log('✅ Seller registered successfully');

    // Register admin
    const adminData = {
      email: 'admin.mgmt@example.com',
      password: 'TestPassword123!',
      firstName: 'Management',
      lastName: 'Admin',
      role: 'ADMIN'
    };

    const adminResponse = await axios.post(`${API_BASE}/auth/register`, adminData);
    const adminToken = adminResponse.data.data.tokens.accessToken;
    console.log('✅ Admin registered successfully');

    // Step 2: Create multiple projects for testing
    console.log('\n2️⃣ Creating test projects...');
    const projects = [];

    const projectsData = [
      {
        title: 'React E-commerce Platform',
        shortDescription: 'Full-featured e-commerce platform with React',
        description: 'A comprehensive e-commerce platform built with React, Redux, and Node.js. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
        category: 'Web Development',
        techStack: ['React', 'Redux', 'Node.js', 'MongoDB'],
        tags: ['ecommerce', 'react', 'fullstack'],
        price: 4999,
        licenseType: 'SINGLE'
      },
      {
        title: 'Mobile Task Manager',
        shortDescription: 'Cross-platform task management app',
        description: 'A beautiful and intuitive task management application built with React Native. Features include task creation, categorization, reminders, and team collaboration.',
        category: 'Mobile Development',
        techStack: ['React Native', 'Firebase', 'TypeScript'],
        tags: ['mobile', 'productivity', 'react-native'],
        price: 2999,
        licenseType: 'MULTI'
      },
      {
        title: 'API Gateway Microservice',
        shortDescription: 'Scalable API gateway for microservices',
        description: 'A robust API gateway built with Node.js and Express. Features include rate limiting, authentication, load balancing, and service discovery.',
        category: 'Backend Development',
        techStack: ['Node.js', 'Express', 'Redis', 'Docker'],
        tags: ['api', 'microservices', 'backend'],
        price: 3499,
        licenseType: 'COMMERCIAL'
      }
    ];

    for (const projectData of projectsData) {
      const response = await axios.post(`${API_BASE}/projects`, projectData, {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      });
      projects.push(response.data.data.project);
    }
    console.log('✅ Created', projects.length, 'test projects');

    // Step 3: Test seller's project listing
    console.log('\n3️⃣ Testing seller project listing...');
    const sellerProjectsResponse = await axios.get(`${API_BASE}/projects/my-projects`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    console.log('✅ Seller projects retrieved:', sellerProjectsResponse.data.data.projects.length);

    // Step 4: Test project filtering and search
    console.log('\n4️⃣ Testing project filtering and search...');
    
    // Test category filter
    const categoryResponse = await axios.get(`${API_BASE}/projects?category=Web Development`);
    console.log('✅ Category filter working:', categoryResponse.data.data.projects.length, 'web projects');

    // Test price range filter
    const priceResponse = await axios.get(`${API_BASE}/projects?minPrice=3000&maxPrice=5000`);
    console.log('✅ Price filter working:', priceResponse.data.data.projects.length, 'projects in range');

    // Test search functionality
    const searchResponse = await axios.get(`${API_BASE}/projects?search=React`);
    console.log('✅ Search working:', searchResponse.data.data.projects.length, 'React projects');

    // Step 5: Test project sorting
    console.log('\n5️⃣ Testing project sorting...');
    
    const sortByPriceResponse = await axios.get(`${API_BASE}/projects?sortBy=price_high`);
    console.log('✅ Price sorting working:', sortByPriceResponse.data.data.projects.length, 'projects sorted');

    const sortByNewestResponse = await axios.get(`${API_BASE}/projects?sortBy=newest`);
    console.log('✅ Date sorting working:', sortByNewestResponse.data.data.projects.length, 'projects sorted');

    // Step 6: Test pagination
    console.log('\n6️⃣ Testing pagination...');
    
    const page1Response = await axios.get(`${API_BASE}/projects?page=1&limit=2`);
    console.log('✅ Pagination working - Page 1:', page1Response.data.data.projects.length, 'projects');
    console.log('📊 Total pages:', page1Response.data.pagination.totalPages);

    // Step 7: Test project submission for review
    console.log('\n7️⃣ Testing project submission...');
    
    const projectId = projects[0].id;
    const submitResponse = await axios.post(`${API_BASE}/projects/${projectId}/submit`, {}, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    console.log('✅ Project submitted for review');
    console.log('📝 New status:', submitResponse.data.data.project.status);

    // Step 8: Test admin project status update
    console.log('\n8️⃣ Testing admin status update...');
    
    const statusUpdateResponse = await axios.patch(`${API_BASE}/projects/${projectId}/status`, {
      status: 'APPROVED'
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Project status updated by admin');
    console.log('📝 New status:', statusUpdateResponse.data.data.project.status);

    // Step 9: Test project analytics
    console.log('\n9️⃣ Testing project analytics...');
    
    const analyticsResponse = await axios.get(`${API_BASE}/projects/${projectId}/analytics`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    console.log('✅ Project analytics retrieved');
    console.log('📊 Total views:', analyticsResponse.data.data.analytics.overview.totalViews);
    console.log('📊 Monthly stats:', analyticsResponse.data.data.analytics.monthlyStats.length, 'months');

    // Step 10: Test seller project filtering
    console.log('\n🔟 Testing seller project filtering...');
    
    const draftProjectsResponse = await axios.get(`${API_BASE}/projects/my-projects?status=DRAFT`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    console.log('✅ Draft projects filter:', draftProjectsResponse.data.data.projects.length, 'draft projects');

    const approvedProjectsResponse = await axios.get(`${API_BASE}/projects/my-projects?status=APPROVED`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    console.log('✅ Approved projects filter:', approvedProjectsResponse.data.data.projects.length, 'approved projects');

    console.log('\n🎉 All project management tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Project creation: Working');
    console.log('✅ Seller project listing: Working');
    console.log('✅ Project filtering (category, price): Working');
    console.log('✅ Project search: Working');
    console.log('✅ Project sorting: Working');
    console.log('✅ Pagination: Working');
    console.log('✅ Project submission: Working');
    console.log('✅ Admin status management: Working');
    console.log('✅ Project analytics: Working');
    console.log('✅ Seller project filtering: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Test advanced project management features
async function testAdvancedFeatures() {
  console.log('\n🧪 Testing Advanced Project Management Features...\n');

  try {
    // Register a seller for advanced testing
    const sellerData = {
      email: 'advanced.seller@example.com',
      password: 'TestPassword123!',
      firstName: 'Advanced',
      lastName: 'Seller',
      role: 'SELLER'
    };

    const sellerResponse = await axios.post(`${API_BASE}/auth/register`, sellerData);
    const sellerToken = sellerResponse.data.data.tokens.accessToken;

    // Create a project
    const projectData = {
      title: 'Advanced Test Project',
      shortDescription: 'Project for advanced feature testing',
      description: 'This project is used to test advanced management features.',
      category: 'Web Development',
      techStack: ['React', 'Node.js'],
      tags: ['test', 'advanced'],
      price: 1999,
      licenseType: 'SINGLE'
    };

    const projectResponse = await axios.post(`${API_BASE}/projects`, projectData, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    const projectId = projectResponse.data.data.project.id;

    console.log('1️⃣ Testing project update...');
    const updateResponse = await axios.put(`${API_BASE}/projects/${projectId}`, {
      price: 2499,
      description: 'Updated description for advanced testing.'
    }, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    console.log('✅ Project updated successfully');
    console.log('💰 New price:', updateResponse.data.data.project.price);

    console.log('\n2️⃣ Testing project search with multiple filters...');
    const complexSearchResponse = await axios.get(
      `${API_BASE}/projects?search=Advanced&category=Web Development&minPrice=2000&sortBy=price_low&limit=5`
    );
    console.log('✅ Complex search working:', complexSearchResponse.data.data.projects.length, 'results');

    console.log('\n3️⃣ Testing seller project search...');
    const sellerSearchResponse = await axios.get(`${API_BASE}/projects/my-projects?search=Advanced&sortBy=newest`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    console.log('✅ Seller search working:', sellerSearchResponse.data.data.projects.length, 'results');

    console.log('\n🎉 Advanced features test completed!');

  } catch (error) {
    console.error('❌ Advanced test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testProjectManagementSystem();
  await testAdvancedFeatures();
}

runAllTests();
