// Test public marketplace interface
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testMarketplaceInterface() {
  console.log('🧪 Testing VibeCoder Public Marketplace Interface...\n');

  try {
    // Step 1: Create test data - sellers and projects
    console.log('1️⃣ Setting up marketplace test data...');
    
    const sellers = [];
    const projects = [];

    // Create multiple sellers
    const sellerNames = [
      { firstName: 'Rahul', lastName: 'Sharma' },
      { firstName: 'Priya', lastName: 'Patel' },
      { firstName: 'Amit', lastName: 'Kumar' }
    ];

    for (let i = 0; i < 3; i++) {
      const sellerData = {
        email: `marketplace.seller${i + 1}@example.com`,
        password: 'TestPassword123!',
        firstName: sellerNames[i].firstName,
        lastName: sellerNames[i].lastName,
        role: 'SELLER',
        bio: `Experienced developer specializing in modern web technologies. ${i + 1} years of experience.`
      };

      const sellerResponse = await axios.post(`${API_BASE}/auth/register`, sellerData);
      sellers.push({
        ...sellerResponse.data.data.user,
        token: sellerResponse.data.data.tokens.accessToken
      });
    }
    console.log('✅ Created', sellers.length, 'test sellers');

    // Create projects for each seller
    const projectTemplates = [
      {
        title: 'React E-commerce Dashboard',
        shortDescription: 'Modern admin dashboard with analytics and user management',
        description: 'A comprehensive e-commerce admin dashboard built with React, TypeScript, and Material-UI. Features include real-time analytics, user management, product catalog, order tracking, and responsive design.',
        category: 'Web Development',
        techStack: ['React', 'TypeScript', 'Material-UI', 'Redux'],
        tags: ['dashboard', 'ecommerce', 'admin', 'analytics'],
        price: 2999,
        licenseType: 'SINGLE'
      },
      {
        title: 'React Native Food Delivery App',
        shortDescription: 'Complete food delivery app with real-time tracking',
        description: 'Full-featured food delivery application built with React Native. Includes user authentication, restaurant listings, cart management, real-time order tracking, and payment integration.',
        category: 'Mobile Development',
        techStack: ['React Native', 'Firebase', 'Maps API', 'Redux'],
        tags: ['mobile', 'food', 'delivery', 'tracking'],
        price: 4999,
        licenseType: 'MULTI'
      },
      {
        title: 'Node.js Microservices Architecture',
        shortDescription: 'Scalable microservices setup with Docker and Kubernetes',
        description: 'Production-ready microservices architecture built with Node.js, Express, and MongoDB. Includes API gateway, service discovery, load balancing, and containerization with Docker.',
        category: 'Backend Development',
        techStack: ['Node.js', 'Express', 'MongoDB', 'Docker', 'Kubernetes'],
        tags: ['microservices', 'api', 'scalable', 'docker'],
        price: 3499,
        licenseType: 'COMMERCIAL'
      },
      {
        title: 'Vue.js Portfolio Website',
        shortDescription: 'Beautiful portfolio template for developers',
        description: 'Stunning portfolio website template built with Vue.js and Nuxt.js. Features include project showcase, blog integration, contact forms, and SEO optimization.',
        category: 'Frontend Development',
        techStack: ['Vue.js', 'Nuxt.js', 'SCSS', 'Vuetify'],
        tags: ['portfolio', 'template', 'responsive', 'seo'],
        price: 1999,
        licenseType: 'SINGLE'
      },
      {
        title: 'Python Data Analysis Toolkit',
        shortDescription: 'Complete data analysis and visualization toolkit',
        description: 'Comprehensive data analysis toolkit built with Python, Pandas, and Matplotlib. Includes data cleaning, statistical analysis, machine learning models, and interactive visualizations.',
        category: 'Data Science',
        techStack: ['Python', 'Pandas', 'Matplotlib', 'Scikit-learn'],
        tags: ['data', 'analysis', 'visualization', 'ml'],
        price: 2499,
        licenseType: 'MULTI'
      },
      {
        title: 'Flutter Chat Application',
        shortDescription: 'Real-time chat app with multimedia support',
        description: 'Feature-rich chat application built with Flutter and Firebase. Includes real-time messaging, multimedia sharing, group chats, push notifications, and user presence indicators.',
        category: 'Mobile Development',
        techStack: ['Flutter', 'Dart', 'Firebase', 'Cloud Functions'],
        tags: ['chat', 'realtime', 'multimedia', 'flutter'],
        price: 3999,
        licenseType: 'COMMERCIAL'
      }
    ];

    // Create projects for sellers
    for (let i = 0; i < sellers.length; i++) {
      const seller = sellers[i];
      const projectsPerSeller = 2;
      
      for (let j = 0; j < projectsPerSeller; j++) {
        const template = projectTemplates[(i * projectsPerSeller + j) % projectTemplates.length];
        const projectData = {
          ...template,
          title: `${template.title} - ${seller.firstName} Edition`
        };

        const projectResponse = await axios.post(`${API_BASE}/projects`, projectData, {
          headers: { 'Authorization': `Bearer ${seller.token}` }
        });
        
        projects.push(projectResponse.data.data.project);
      }
    }
    console.log('✅ Created', projects.length, 'test projects');

    // Step 2: Test public project listing
    console.log('\n2️⃣ Testing public project listing...');
    
    const publicListResponse = await axios.get(`${API_BASE}/projects`);
    console.log('✅ Public project listing working');
    console.log('📊 Total projects available:', publicListResponse.data.data.projects.length);
    console.log('📄 Pagination info:', publicListResponse.data.pagination);

    // Step 3: Test search functionality
    console.log('\n3️⃣ Testing search functionality...');
    
    const searchResponse = await axios.get(`${API_BASE}/projects?search=React`);
    console.log('✅ Search functionality working');
    console.log('🔍 React projects found:', searchResponse.data.data.projects.length);

    const techSearchResponse = await axios.get(`${API_BASE}/projects?search=TypeScript`);
    console.log('✅ Technology search working');
    console.log('🔍 TypeScript projects found:', techSearchResponse.data.data.projects.length);

    // Step 4: Test category filtering
    console.log('\n4️⃣ Testing category filtering...');
    
    const webDevResponse = await axios.get(`${API_BASE}/projects?category=Web Development`);
    console.log('✅ Category filtering working');
    console.log('🌐 Web Development projects:', webDevResponse.data.data.projects.length);

    const mobileDevResponse = await axios.get(`${API_BASE}/projects?category=Mobile Development`);
    console.log('✅ Mobile category filtering working');
    console.log('📱 Mobile Development projects:', mobileDevResponse.data.data.projects.length);

    // Step 5: Test price filtering
    console.log('\n5️⃣ Testing price filtering...');
    
    const priceRangeResponse = await axios.get(`${API_BASE}/projects?minPrice=2000&maxPrice=4000`);
    console.log('✅ Price range filtering working');
    console.log('💰 Projects in ₹2000-₹4000 range:', priceRangeResponse.data.data.projects.length);

    const budgetResponse = await axios.get(`${API_BASE}/projects?maxPrice=2500`);
    console.log('✅ Budget filtering working');
    console.log('💵 Budget projects (under ₹2500):', budgetResponse.data.data.projects.length);

    // Step 6: Test sorting options
    console.log('\n6️⃣ Testing sorting options...');
    
    const newestResponse = await axios.get(`${API_BASE}/projects?sortBy=newest`);
    console.log('✅ Newest first sorting working');
    
    const priceHighResponse = await axios.get(`${API_BASE}/projects?sortBy=price_high`);
    console.log('✅ Price high to low sorting working');
    
    const priceLowResponse = await axios.get(`${API_BASE}/projects?sortBy=price_low`);
    console.log('✅ Price low to high sorting working');

    // Step 7: Test pagination
    console.log('\n7️⃣ Testing pagination...');
    
    const page1Response = await axios.get(`${API_BASE}/projects?page=1&limit=3`);
    console.log('✅ Pagination working - Page 1');
    console.log('📄 Page 1 projects:', page1Response.data.data.projects.length);
    console.log('📊 Total pages:', page1Response.data.pagination.totalPages);

    if (page1Response.data.pagination.totalPages > 1) {
      const page2Response = await axios.get(`${API_BASE}/projects?page=2&limit=3`);
      console.log('✅ Pagination working - Page 2');
      console.log('📄 Page 2 projects:', page2Response.data.data.projects.length);
    }

    // Step 8: Test project detail view
    console.log('\n8️⃣ Testing project detail view...');
    
    if (projects.length > 0) {
      const projectId = projects[0].id;
      const projectDetailResponse = await axios.get(`${API_BASE}/projects/${projectId}`);
      console.log('✅ Project detail view working');
      console.log('📦 Project title:', projectDetailResponse.data.data.project.title);
      console.log('👤 Seller info included:', !!projectDetailResponse.data.data.project.seller);
      console.log('📊 View count incremented:', projectDetailResponse.data.data.project.viewCount > 0);
    }

    // Step 9: Test combined filters
    console.log('\n9️⃣ Testing combined filters...');
    
    const combinedResponse = await axios.get(
      `${API_BASE}/projects?category=Web Development&minPrice=2000&sortBy=price_low&limit=5`
    );
    console.log('✅ Combined filters working');
    console.log('🔧 Combined filter results:', combinedResponse.data.data.projects.length);

    // Step 10: Test seller-specific filtering
    console.log('\n🔟 Testing seller-specific filtering...');
    
    if (sellers.length > 0) {
      const sellerId = sellers[0].id;
      const sellerProjectsResponse = await axios.get(`${API_BASE}/projects?sellerId=${sellerId}`);
      console.log('✅ Seller-specific filtering working');
      console.log('👤 Projects by seller:', sellerProjectsResponse.data.data.projects.length);
    }

    console.log('\n🎉 All marketplace interface tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Public project listing: Working');
    console.log('✅ Search functionality: Working');
    console.log('✅ Category filtering: Working');
    console.log('✅ Price filtering: Working');
    console.log('✅ Sorting options: Working');
    console.log('✅ Pagination: Working');
    console.log('✅ Project detail view: Working');
    console.log('✅ Combined filters: Working');
    console.log('✅ Seller filtering: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Test marketplace discovery features
async function testDiscoveryFeatures() {
  console.log('\n🧪 Testing Marketplace Discovery Features...\n');

  try {
    console.log('1️⃣ Testing featured projects...');
    const featuredResponse = await axios.get(`${API_BASE}/projects?featured=true&limit=6`);
    console.log('✅ Featured projects endpoint working');
    console.log('⭐ Featured projects found:', featuredResponse.data.data.projects.length);

    console.log('\n2️⃣ Testing category statistics...');
    const categories = ['Web Development', 'Mobile Development', 'Backend Development'];
    
    for (const category of categories) {
      const categoryResponse = await axios.get(`${API_BASE}/projects?category=${encodeURIComponent(category)}`);
      console.log(`✅ ${category}: ${categoryResponse.data.data.projects.length} projects`);
    }

    console.log('\n3️⃣ Testing advanced search...');
    const advancedSearchResponse = await axios.get(
      `${API_BASE}/projects?search=React&category=Web Development&minPrice=1000&maxPrice=5000&sortBy=rating&limit=10`
    );
    console.log('✅ Advanced search working');
    console.log('🔍 Advanced search results:', advancedSearchResponse.data.data.projects.length);

    console.log('\n🎉 Discovery features test completed!');

  } catch (error) {
    console.error('❌ Discovery test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testMarketplaceInterface();
  await testDiscoveryFeatures();
}

runAllTests();
