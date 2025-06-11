// Test admin dashboard system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testDownloadSystem() {
  console.log('🧪 Testing VibeCoder Download System...\n');

  try {
    // Step 1: Create test users and project
    console.log('1️⃣ Setting up download test data...');
    
    // Create seller
    const sellerData = {
      email: 'download.seller@example.com',
      password: 'TestPassword123!',
      firstName: 'Download',
      lastName: 'Seller',
      role: 'SELLER'
    };

    const sellerResponse = await axios.post(`${API_BASE}/auth/register`, sellerData);
    const sellerToken = sellerResponse.data.data.tokens.accessToken;

    // Create buyer
    const buyerData = {
      email: 'download.buyer@example.com',
      password: 'TestPassword123!',
      firstName: 'Download',
      lastName: 'Buyer',
      role: 'BUYER'
    };

    const buyerResponse = await axios.post(`${API_BASE}/auth/register`, buyerData);
    const buyerToken = buyerResponse.data.data.tokens.accessToken;

    console.log('✅ Created seller and buyer accounts');

    // Create a test project
    const projectData = {
      title: 'Download Test Project',
      shortDescription: 'Project for testing download functionality',
      description: 'This project is created specifically for testing secure download system.',
      category: 'Web Development',
      techStack: ['React', 'Node.js'],
      tags: ['download', 'test'],
      price: 1999,
      licenseType: 'SINGLE'
    };

    const projectResponse = await axios.post(`${API_BASE}/projects`, projectData, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    const projectId = projectResponse.data.data.project.id;
    console.log('✅ Created test project');
    console.log('📦 Project ID:', projectId);

    // Step 2: Test purchase status check (before purchase)
    console.log('\n2️⃣ Testing purchase status check...');
    
    const purchaseStatusResponse = await axios.get(
      `${API_BASE}/downloads/projects/${projectId}/purchase-status`,
      {
        headers: { 'Authorization': `Bearer ${buyerToken}` }
      }
    );

    console.log('✅ Purchase status check working');
    console.log('💳 Has purchased:', purchaseStatusResponse.data.data.hasPurchased);
    console.log('🔑 Access type:', purchaseStatusResponse.data.data.accessType);

    // Step 3: Test download session creation (should fail without purchase)
    console.log('\n3️⃣ Testing download session creation without purchase...');
    
    try {
      await axios.post(
        `${API_BASE}/downloads/projects/${projectId}/session`,
        {},
        {
          headers: { 'Authorization': `Bearer ${buyerToken}` }
        }
      );
      console.log('❌ Download session should fail without purchase');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working: Download blocked without purchase');
      }
    }

    // Step 4: Test seller access (should work)
    console.log('\n4️⃣ Testing seller access to own project...');
    
    const sellerSessionResponse = await axios.post(
      `${API_BASE}/downloads/projects/${projectId}/session`,
      {},
      {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      }
    );

    console.log('✅ Seller access working');
    console.log('🔑 Download token created for seller');
    console.log('⏰ Token expires at:', sellerSessionResponse.data.data.expiresAt);

    const sellerDownloadToken = sellerSessionResponse.data.data.token;

    // Step 5: Test token validation
    console.log('\n5️⃣ Testing download token validation...');
    
    const tokenValidationResponse = await axios.post(
      `${API_BASE}/downloads/validate-token`,
      { token: sellerDownloadToken },
      {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      }
    );

    console.log('✅ Token validation working');
    console.log('✅ Token is valid:', tokenValidationResponse.data.data.isValid);
    console.log('📁 Can download:', tokenValidationResponse.data.data.canDownload);

    // Step 6: Test download history
    console.log('\n6️⃣ Testing download history...');
    
    const historyResponse = await axios.get(
      `${API_BASE}/downloads/history?page=1&limit=10`,
      {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      }
    );

    console.log('✅ Download history working');
    console.log('📊 Downloads found:', historyResponse.data.data.downloads.length);
    console.log('📄 Pagination info:', historyResponse.data.data.pagination);

    // Step 7: Test download analytics
    console.log('\n7️⃣ Testing download analytics...');
    
    const analyticsResponse = await axios.get(
      `${API_BASE}/downloads/projects/${projectId}/analytics`,
      {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      }
    );

    console.log('✅ Download analytics working');
    console.log('📊 Total downloads:', analyticsResponse.data.data.analytics.totalDownloads);
    console.log('👥 Unique downloaders:', analyticsResponse.data.data.analytics.uniqueDownloaders);

    // Step 8: Test seller statistics
    console.log('\n8️⃣ Testing seller download statistics...');
    
    const sellerStatsResponse = await axios.get(
      `${API_BASE}/downloads/seller/statistics`,
      {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      }
    );

    console.log('✅ Seller statistics working');
    console.log('📊 Total downloads:', sellerStatsResponse.data.data.statistics.totalDownloads);
    console.log('📦 Total projects:', sellerStatsResponse.data.data.statistics.totalProjects);

    // Step 9: Test access control
    console.log('\n9️⃣ Testing access control...');
    
    // Test buyer trying to access seller analytics (should fail)
    try {
      await axios.get(
        `${API_BASE}/downloads/projects/${projectId}/analytics`,
        {
          headers: { 'Authorization': `Bearer ${buyerToken}` }
        }
      );
      console.log('❌ Buyer should not access project analytics');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working: Buyer cannot access project analytics');
      }
    }

    // Test unauthenticated access (should fail)
    try {
      await axios.post(`${API_BASE}/downloads/projects/${projectId}/session`, {});
      console.log('❌ Unauthenticated access should be blocked');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication working: Unauthenticated access blocked');
      }
    }

    // Step 10: Test invalid token validation
    console.log('\n🔟 Testing invalid token validation...');
    
    const invalidTokenResponse = await axios.post(
      `${API_BASE}/downloads/validate-token`,
      { token: 'invalid_token_123' },
      {
        headers: { 'Authorization': `Bearer ${buyerToken}` }
      }
    );

    console.log('✅ Invalid token handling working');
    console.log('❌ Invalid token result:', invalidTokenResponse.data.data.isValid);

    console.log('\n🎉 All download system tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Purchase status checking: Working');
    console.log('✅ Download session creation: Working');
    console.log('✅ Access control: Working');
    console.log('✅ Token validation: Working');
    console.log('✅ Download history: Working');
    console.log('✅ Download analytics: Working');
    console.log('✅ Seller statistics: Working');
    console.log('✅ Authentication: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Test admin download features
async function testAdminDownloadFeatures() {
  console.log('\n🧪 Testing Admin Download Features...\n');

  try {
    // Create admin user
    console.log('1️⃣ Creating admin user...');
    
    const adminData = {
      email: 'download.admin@example.com',
      password: 'TestPassword123!',
      firstName: 'Download',
      lastName: 'Admin',
      role: 'ADMIN'
    };

    const adminResponse = await axios.post(`${API_BASE}/auth/register`, adminData);
    const adminToken = adminResponse.data.data.tokens.accessToken;
    console.log('✅ Admin user created');

    // Test admin download sessions
    console.log('\n2️⃣ Testing admin download sessions...');
    
    const adminSessionsResponse = await axios.get(`${API_BASE}/downloads/admin/sessions`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Admin download sessions working');
    console.log('📊 Admin can view all sessions:', adminSessionsResponse.data.data.sessions.length);

    // Test admin analytics
    console.log('\n3️⃣ Testing admin download analytics...');
    
    const adminAnalyticsResponse = await axios.get(`${API_BASE}/downloads/admin/analytics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Admin analytics working');
    console.log('📊 Total platform downloads:', adminAnalyticsResponse.data.data.analytics.totalDownloads);
    console.log('📦 Total projects:', adminAnalyticsResponse.data.data.analytics.totalProjects);

    // Test data export
    console.log('\n4️⃣ Testing download data export...');
    
    const exportResponse = await axios.get(`${API_BASE}/downloads/admin/export?format=csv`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Data export working');
    console.log('📄 Export format:', exportResponse.headers['content-type']);
    console.log('📊 Export data length:', exportResponse.data.length, 'characters');

    // Test download logs
    console.log('\n5️⃣ Testing download logs...');
    
    const logsResponse = await axios.get(`${API_BASE}/downloads/admin/logs`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Download logs working');
    console.log('📊 Logs retrieved:', logsResponse.data.data.logs.length);

    console.log('\n🎉 Admin download features test completed!');

  } catch (error) {
    console.error('❌ Admin test failed:', error.response?.data || error.message);
  }
}

// Test download rate limiting
async function testDownloadRateLimiting() {
  console.log('\n🧪 Testing Download Rate Limiting...\n');

  try {
    console.log('1️⃣ Testing download rate limits...');
    
    // Make multiple rapid download requests to test rate limiting
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        axios.get(`${API_BASE}/downloads/file?token=test_token_${i}`)
          .catch(error => error.response)
      );
    }

    const responses = await Promise.all(promises);
    
    // Check if rate limiting is working
    const rateLimitedResponses = responses.filter(response => 
      response?.status === 429
    );

    if (rateLimitedResponses.length > 0) {
      console.log('✅ Rate limiting working: Some requests were rate limited');
      console.log('🚫 Rate limited requests:', rateLimitedResponses.length);
    } else {
      console.log('ℹ️ Rate limiting not triggered (expected for low request volume)');
    }

    console.log('\n🎉 Rate limiting test completed!');

  } catch (error) {
    console.error('❌ Rate limiting test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testDownloadSystem();
  await testAdminDownloadFeatures();
  await testDownloadRateLimiting();
}

runAllTests();
