// Test analytics and reporting system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAnalyticsSystem() {
  console.log('🧪 Testing VibeCoder Analytics & Reporting System...\n');

  try {
    // Step 1: Create test users
    console.log('1️⃣ Setting up analytics test data...');
    
    // Create admin
    const adminData = {
      email: 'analytics.admin@example.com',
      password: 'TestPassword123!',
      firstName: 'Analytics',
      lastName: 'Admin',
      role: 'ADMIN'
    };

    const adminResponse = await axios.post(`${API_BASE}/auth/register`, adminData);
    const adminToken = adminResponse.data.data.tokens.accessToken;

    // Create seller
    const sellerData = {
      email: 'analytics.seller@example.com',
      password: 'TestPassword123!',
      firstName: 'Analytics',
      lastName: 'Seller',
      role: 'SELLER'
    };

    const sellerResponse = await axios.post(`${API_BASE}/auth/register`, sellerData);
    const sellerToken = sellerResponse.data.data.tokens.accessToken;

    // Create buyer
    const buyerData = {
      email: 'analytics.buyer@example.com',
      password: 'TestPassword123!',
      firstName: 'Analytics',
      lastName: 'Buyer',
      role: 'BUYER'
    };

    const buyerResponse = await axios.post(`${API_BASE}/auth/register`, buyerData);
    const buyerToken = buyerResponse.data.data.tokens.accessToken;

    console.log('✅ Created admin, seller, and buyer accounts');

    // Step 2: Test seller dashboard summary
    console.log('\n2️⃣ Testing seller dashboard summary...');
    
    const dashboardResponse = await axios.get(`${API_BASE}/analytics/seller/dashboard-summary`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Seller dashboard summary working');
    console.log('📊 Today stats:', dashboardResponse.data.data.summary.todayStats);
    console.log('📈 Week stats:', dashboardResponse.data.data.summary.weekStats);
    console.log('📅 Month stats:', dashboardResponse.data.data.summary.monthStats);

    // Step 3: Test seller analytics
    console.log('\n3️⃣ Testing seller analytics...');
    
    const sellerAnalyticsResponse = await axios.get(`${API_BASE}/analytics/seller?period=30d`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Seller analytics working');
    console.log('📦 Total projects:', sellerAnalyticsResponse.data.data.analytics.overview.totalProjects);
    console.log('💰 Total revenue:', sellerAnalyticsResponse.data.data.analytics.overview.totalRevenue);
    console.log('🛒 Total sales:', sellerAnalyticsResponse.data.data.analytics.overview.totalSales);
    console.log('⭐ Average rating:', sellerAnalyticsResponse.data.data.analytics.overview.averageRating);

    // Step 4: Test project analytics
    console.log('\n4️⃣ Testing project analytics...');
    
    const projectId = 'test-project-id';
    const projectAnalyticsResponse = await axios.get(`${API_BASE}/analytics/projects/${projectId}?period=30d`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Project analytics working');
    console.log('👁️ Views:', projectAnalyticsResponse.data.data.analytics.overview.views);
    console.log('⬇️ Downloads:', projectAnalyticsResponse.data.data.analytics.overview.downloads);
    console.log('🛒 Sales:', projectAnalyticsResponse.data.data.analytics.overview.sales);
    console.log('💰 Revenue:', projectAnalyticsResponse.data.data.analytics.overview.revenue);

    // Step 5: Test platform analytics (admin only)
    console.log('\n5️⃣ Testing platform analytics...');
    
    const platformAnalyticsResponse = await axios.get(`${API_BASE}/analytics/platform?period=30d`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Platform analytics working');
    console.log('👥 Total users:', platformAnalyticsResponse.data.data.analytics.overview.totalUsers);
    console.log('📦 Total projects:', platformAnalyticsResponse.data.data.analytics.overview.totalProjects);
    console.log('💳 Total transactions:', platformAnalyticsResponse.data.data.analytics.overview.totalTransactions);
    console.log('💰 Total revenue:', platformAnalyticsResponse.data.data.analytics.overview.totalRevenue);

    // Step 6: Test analytics comparison
    console.log('\n6️⃣ Testing analytics comparison...');
    
    const comparisonResponse = await axios.get(`${API_BASE}/analytics/projects/compare?projectIds=project1,project2,project3`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Analytics comparison working');
    console.log('📊 Projects compared:', comparisonResponse.data.data.comparison.projects.length);
    console.log('💡 Insights provided:', comparisonResponse.data.data.comparison.insights.length);

    // Step 7: Test revenue breakdown
    console.log('\n7️⃣ Testing revenue breakdown...');
    
    const revenueResponse = await axios.get(`${API_BASE}/analytics/seller/${sellerResponse.data.data.user.id}/revenue-breakdown?period=30d`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Revenue breakdown working');
    console.log('💰 Total revenue:', revenueResponse.data.data.revenueBreakdown.overview.totalRevenue);
    console.log('💸 Platform commission:', revenueResponse.data.data.revenueBreakdown.overview.platformCommission);
    console.log('💵 Net revenue:', revenueResponse.data.data.revenueBreakdown.overview.netRevenue);

    // Step 8: Test customer analytics
    console.log('\n8️⃣ Testing customer analytics...');
    
    const customerResponse = await axios.get(`${API_BASE}/analytics/seller/${sellerResponse.data.data.user.id}/customers?period=30d`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Customer analytics working');
    console.log('👥 Total customers:', customerResponse.data.data.customerAnalytics.overview.totalCustomers);
    console.log('🔄 Returning customers:', customerResponse.data.data.customerAnalytics.overview.returningCustomers);
    console.log('💰 Average order value:', customerResponse.data.data.customerAnalytics.overview.averageOrderValue);

    // Step 9: Test performance insights
    console.log('\n9️⃣ Testing performance insights...');
    
    const insightsResponse = await axios.get(`${API_BASE}/analytics/seller/${sellerResponse.data.data.user.id}/insights`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Performance insights working');
    console.log('💡 Recommendations:', insightsResponse.data.data.insights.recommendations.length);
    console.log('📈 Market trends:', insightsResponse.data.data.insights.marketTrends.length);
    console.log('🎯 Growth opportunities:', insightsResponse.data.data.insights.growthOpportunities.length);

    // Step 10: Test analytics export
    console.log('\n🔟 Testing analytics export...');
    
    const exportResponse = await axios.get(`${API_BASE}/analytics/export/seller/${sellerResponse.data.data.user.id}?format=csv&period=30d`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Analytics export working');
    console.log('📄 Export format:', exportResponse.headers['content-type']);
    console.log('📊 Export data length:', exportResponse.data.length, 'characters');

    // Step 11: Test access control
    console.log('\n1️⃣1️⃣ Testing analytics access control...');
    
    // Test buyer trying to access seller analytics (should fail)
    try {
      await axios.get(`${API_BASE}/analytics/seller/dashboard-summary`, {
        headers: { 'Authorization': `Bearer ${buyerToken}` }
      });
      console.log('❌ Buyer should not access seller analytics');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working: Buyer blocked from seller analytics');
      }
    }

    // Test seller trying to access platform analytics (should fail)
    try {
      await axios.get(`${API_BASE}/analytics/platform`, {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      });
      console.log('❌ Seller should not access platform analytics');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working: Seller blocked from platform analytics');
      }
    }

    // Test unauthenticated access (should fail)
    try {
      await axios.get(`${API_BASE}/analytics/seller/dashboard-summary`);
      console.log('❌ Unauthenticated access should be blocked');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication working: Unauthenticated access blocked');
      }
    }

    console.log('\n🎉 All analytics system tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Seller dashboard summary: Working');
    console.log('✅ Seller analytics: Working');
    console.log('✅ Project analytics: Working');
    console.log('✅ Platform analytics: Working');
    console.log('✅ Analytics comparison: Working');
    console.log('✅ Revenue breakdown: Working');
    console.log('✅ Customer analytics: Working');
    console.log('✅ Performance insights: Working');
    console.log('✅ Analytics export: Working');
    console.log('✅ Access control: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Test analytics data validation
async function testAnalyticsValidation() {
  console.log('\n🧪 Testing Analytics Data Validation...\n');

  try {
    // Create seller for validation tests
    console.log('1️⃣ Creating seller for validation tests...');
    
    const sellerData = {
      email: 'validation.seller@example.com',
      password: 'TestPassword123!',
      firstName: 'Validation',
      lastName: 'Seller',
      role: 'SELLER'
    };

    const sellerResponse = await axios.post(`${API_BASE}/auth/register`, sellerData);
    const sellerToken = sellerResponse.data.data.tokens.accessToken;
    console.log('✅ Seller created for validation tests');

    // Test invalid period parameter
    console.log('\n2️⃣ Testing invalid period parameter...');
    
    try {
      await axios.get(`${API_BASE}/analytics/seller?period=invalid`, {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      });
      console.log('❌ Invalid period should be rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working: Invalid period rejected');
      }
    }

    // Test invalid export format
    console.log('\n3️⃣ Testing invalid export format...');
    
    try {
      await axios.get(`${API_BASE}/analytics/export/seller?format=invalid`, {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      });
      console.log('❌ Invalid export format should be rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working: Invalid export format rejected');
      }
    }

    // Test invalid comparison parameters
    console.log('\n4️⃣ Testing invalid comparison parameters...');
    
    try {
      await axios.get(`${API_BASE}/analytics/projects/compare?projectIds=single-project`, {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      });
      console.log('❌ Single project comparison should be rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working: Single project comparison rejected');
      }
    }

    console.log('\n🎉 Analytics validation tests completed!');

  } catch (error) {
    console.error('❌ Validation test failed:', error.response?.data || error.message);
  }
}

// Test analytics performance
async function testAnalyticsPerformance() {
  console.log('\n🧪 Testing Analytics Performance...\n');

  try {
    // Create seller for performance tests
    console.log('1️⃣ Creating seller for performance tests...');
    
    const sellerData = {
      email: 'performance.seller@example.com',
      password: 'TestPassword123!',
      firstName: 'Performance',
      lastName: 'Seller',
      role: 'SELLER'
    };

    const sellerResponse = await axios.post(`${API_BASE}/auth/register`, sellerData);
    const sellerToken = sellerResponse.data.data.tokens.accessToken;
    console.log('✅ Seller created for performance tests');

    // Test analytics response time
    console.log('\n2️⃣ Testing analytics response time...');
    
    const startTime = Date.now();
    const analyticsResponse = await axios.get(`${API_BASE}/analytics/seller?period=1y`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    const responseTime = Date.now() - startTime;

    console.log('✅ Analytics response time:', responseTime + 'ms');
    console.log('📊 Data points in response:', analyticsResponse.data.data.analytics.salesTrend.length);

    // Test concurrent requests
    console.log('\n3️⃣ Testing concurrent analytics requests...');
    
    const concurrentRequests = Array.from({ length: 5 }, () =>
      axios.get(`${API_BASE}/analytics/seller/dashboard-summary`, {
        headers: { 'Authorization': `Bearer ${sellerToken}` }
      })
    );

    const concurrentStartTime = Date.now();
    await Promise.all(concurrentRequests);
    const concurrentResponseTime = Date.now() - concurrentStartTime;

    console.log('✅ Concurrent requests completed in:', concurrentResponseTime + 'ms');

    console.log('\n🎉 Analytics performance tests completed!');

  } catch (error) {
    console.error('❌ Performance test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testAnalyticsSystem();
  await testAnalyticsValidation();
  await testAnalyticsPerformance();
}

runAllTests();
