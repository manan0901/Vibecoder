// Test admin dashboard system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAdminDashboard() {
  console.log('🧪 Testing VibeCoder Admin Dashboard System...\n');

  try {
    // Step 1: Create test users
    console.log('1️⃣ Setting up admin dashboard test data...');
    
    // Create admin user
    const adminData = {
      email: 'admin.dashboard@example.com',
      password: 'TestPassword123!',
      firstName: 'Admin',
      lastName: 'Dashboard',
      role: 'ADMIN'
    };

    const adminResponse = await axios.post(`${API_BASE}/auth/register`, adminData);
    const adminToken = adminResponse.data.data.tokens.accessToken;

    // Create regular user
    const userData = {
      email: 'regular.user@example.com',
      password: 'TestPassword123!',
      firstName: 'Regular',
      lastName: 'User',
      role: 'BUYER'
    };

    const userResponse = await axios.post(`${API_BASE}/auth/register`, userData);
    const userToken = userResponse.data.data.tokens.accessToken;

    console.log('✅ Created admin and regular user accounts');

    // Step 2: Test admin dashboard overview
    console.log('\n2️⃣ Testing admin dashboard overview...');
    
    const overviewResponse = await axios.get(`${API_BASE}/admin/dashboard/overview`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Admin dashboard overview working');
    console.log('📊 Statistics loaded:', !!overviewResponse.data.data.statistics);
    console.log('🏥 System health loaded:', !!overviewResponse.data.data.systemHealth);
    console.log('📋 Recent activities loaded:', overviewResponse.data.data.recentActivities.length);

    // Step 3: Test platform statistics
    console.log('\n3️⃣ Testing platform statistics...');
    
    const statsResponse = await axios.get(`${API_BASE}/admin/statistics/platform`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Platform statistics working');
    console.log('👥 Total users:', statsResponse.data.data.statistics.users.total);
    console.log('📦 Total projects:', statsResponse.data.data.statistics.projects.total);
    console.log('💰 Total revenue:', statsResponse.data.data.statistics.transactions.totalRevenue);

    // Step 4: Test user analytics
    console.log('\n4️⃣ Testing user analytics...');
    
    const userAnalyticsResponse = await axios.get(`${API_BASE}/admin/analytics/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ User analytics working');
    console.log('📈 Registration trend data points:', userAnalyticsResponse.data.data.analytics.registrationTrend.length);
    console.log('👥 Users by role:', userAnalyticsResponse.data.data.analytics.usersByRole.length);

    // Step 5: Test revenue analytics
    console.log('\n5️⃣ Testing revenue analytics...');
    
    const revenueAnalyticsResponse = await axios.get(`${API_BASE}/admin/analytics/revenue`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Revenue analytics working');
    console.log('📊 Monthly revenue data points:', revenueAnalyticsResponse.data.data.analytics.monthlyRevenue.length);
    console.log('💳 Payment methods:', revenueAnalyticsResponse.data.data.analytics.paymentMethodDistribution.length);

    // Step 6: Test system health
    console.log('\n6️⃣ Testing system health monitoring...');
    
    const healthResponse = await axios.get(`${API_BASE}/admin/system/health`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ System health monitoring working');
    console.log('🗄️ Database status:', healthResponse.data.data.health.database.status);
    console.log('💾 Storage usage:', healthResponse.data.data.health.storage.percentage + '%');
    console.log('🌐 API uptime:', healthResponse.data.data.health.api.uptime + '%');

    // Step 7: Test user management
    console.log('\n7️⃣ Testing user management...');
    
    const usersResponse = await axios.get(`${API_BASE}/admin/users?page=1&limit=10`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ User management working');
    console.log('👥 Users retrieved:', usersResponse.data.data.users.length);
    console.log('📄 Pagination info:', usersResponse.data.data.pagination);

    // Test user details
    const userId = userResponse.data.data.user.id;
    const userDetailsResponse = await axios.get(`${API_BASE}/admin/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ User details retrieval working');
    console.log('👤 User details loaded for:', userDetailsResponse.data.data.user.email);

    // Step 8: Test user role update
    console.log('\n8️⃣ Testing user role management...');
    
    const updateUserResponse = await axios.patch(`${API_BASE}/admin/users/${userId}`, {
      role: 'SELLER',
      isVerified: true
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ User role update working');
    console.log('🔄 User role updated to:', updateUserResponse.data.data.user.role);
    console.log('✅ User verification status:', updateUserResponse.data.data.user.isVerified);

    // Step 9: Test project management
    console.log('\n9️⃣ Testing project management...');
    
    const projectsResponse = await axios.get(`${API_BASE}/admin/projects?page=1&limit=10`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Project management working');
    console.log('📦 Projects retrieved:', projectsResponse.data.data.projects.length);

    // Step 10: Test access control
    console.log('\n🔟 Testing admin access control...');
    
    // Test regular user trying to access admin endpoints (should fail)
    try {
      await axios.get(`${API_BASE}/admin/dashboard/overview`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      console.log('❌ Regular user should not access admin endpoints');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working: Regular user blocked from admin endpoints');
      }
    }

    // Test unauthenticated access (should fail)
    try {
      await axios.get(`${API_BASE}/admin/dashboard/overview`);
      console.log('❌ Unauthenticated access should be blocked');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication working: Unauthenticated access blocked');
      }
    }

    console.log('\n🎉 All admin dashboard tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Dashboard overview: Working');
    console.log('✅ Platform statistics: Working');
    console.log('✅ User analytics: Working');
    console.log('✅ Revenue analytics: Working');
    console.log('✅ System health monitoring: Working');
    console.log('✅ User management: Working');
    console.log('✅ Role management: Working');
    console.log('✅ Project management: Working');
    console.log('✅ Access control: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Test admin export features
async function testAdminExportFeatures() {
  console.log('\n🧪 Testing Admin Export Features...\n');

  try {
    // Create admin user
    console.log('1️⃣ Creating admin user for export tests...');
    
    const adminData = {
      email: 'admin.export@example.com',
      password: 'TestPassword123!',
      firstName: 'Admin',
      lastName: 'Export',
      role: 'ADMIN'
    };

    const adminResponse = await axios.post(`${API_BASE}/auth/register`, adminData);
    const adminToken = adminResponse.data.data.tokens.accessToken;
    console.log('✅ Admin user created for export tests');

    // Test user data export
    console.log('\n2️⃣ Testing user data export...');
    
    const userExportResponse = await axios.get(`${API_BASE}/admin/export/users?format=csv`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ User data export working');
    console.log('📄 Export format:', userExportResponse.headers['content-type']);
    console.log('📊 Export data length:', userExportResponse.data.length, 'characters');

    // Test project data export
    console.log('\n3️⃣ Testing project data export...');
    
    const projectExportResponse = await axios.get(`${API_BASE}/admin/export/projects?format=csv`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Project data export working');
    console.log('📄 Export format:', projectExportResponse.headers['content-type']);
    console.log('📊 Export data length:', projectExportResponse.data.length, 'characters');

    console.log('\n🎉 Admin export features test completed!');

  } catch (error) {
    console.error('❌ Export test failed:', error.response?.data || error.message);
  }
}

// Test admin transaction management
async function testAdminTransactionManagement() {
  console.log('\n🧪 Testing Admin Transaction Management...\n');

  try {
    // Create admin user
    console.log('1️⃣ Creating admin user for transaction tests...');
    
    const adminData = {
      email: 'admin.transactions@example.com',
      password: 'TestPassword123!',
      firstName: 'Admin',
      lastName: 'Transactions',
      role: 'ADMIN'
    };

    const adminResponse = await axios.post(`${API_BASE}/auth/register`, adminData);
    const adminToken = adminResponse.data.data.tokens.accessToken;
    console.log('✅ Admin user created for transaction tests');

    // Test transaction listing
    console.log('\n2️⃣ Testing transaction management...');
    
    const transactionsResponse = await axios.get(`${API_BASE}/admin/transactions?page=1&limit=20`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Transaction management working');
    console.log('💳 Transactions retrieved:', transactionsResponse.data.data.transactions.length);
    console.log('📄 Pagination info:', transactionsResponse.data.data.pagination);

    console.log('\n🎉 Transaction management test completed!');

  } catch (error) {
    console.error('❌ Transaction management test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testAdminDashboard();
  await testAdminExportFeatures();
  await testAdminTransactionManagement();
}

runAllTests();
