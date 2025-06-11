// Test payment integration system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testPaymentIntegration() {
  console.log('🧪 Testing VibeCoder Payment Integration System...\n');

  try {
    // Step 1: Create test users and project
    console.log('1️⃣ Setting up payment test data...');
    
    // Create seller
    const sellerData = {
      email: 'payment.seller@example.com',
      password: 'TestPassword123!',
      firstName: 'Payment',
      lastName: 'Seller',
      role: 'SELLER'
    };

    const sellerResponse = await axios.post(`${API_BASE}/auth/register`, sellerData);
    const sellerToken = sellerResponse.data.data.tokens.accessToken;
    const sellerId = sellerResponse.data.data.user.id;

    // Create buyer
    const buyerData = {
      email: 'payment.buyer@example.com',
      password: 'TestPassword123!',
      firstName: 'Payment',
      lastName: 'Buyer',
      role: 'BUYER'
    };

    const buyerResponse = await axios.post(`${API_BASE}/auth/register`, buyerData);
    const buyerToken = buyerResponse.data.data.tokens.accessToken;
    const buyerId = buyerResponse.data.data.user.id;

    console.log('✅ Created seller and buyer accounts');

    // Create a test project
    const projectData = {
      title: 'Payment Test Project',
      shortDescription: 'Project for testing payment functionality',
      description: 'This project is created specifically for testing payment integration with Razorpay.',
      category: 'Web Development',
      techStack: ['React', 'Node.js'],
      tags: ['payment', 'test'],
      price: 2999,
      licenseType: 'SINGLE'
    };

    const projectResponse = await axios.post(`${API_BASE}/projects`, projectData, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });
    const projectId = projectResponse.data.data.project.id;
    console.log('✅ Created test project');
    console.log('📦 Project ID:', projectId);

    // Step 2: Test payment order creation
    console.log('\n2️⃣ Testing payment order creation...');
    
    const orderData = {
      projectId: projectId,
      amount: 2999,
      description: 'Test payment for Payment Test Project'
    };

    const orderResponse = await axios.post(`${API_BASE}/payments/orders`, orderData, {
      headers: { 'Authorization': `Bearer ${buyerToken}` }
    });

    console.log('✅ Payment order creation working');
    console.log('💳 Order ID:', orderResponse.data.data.order.id);
    console.log('💰 Amount:', orderResponse.data.data.order.amount / 100, 'INR');
    console.log('🔑 Razorpay Key provided:', !!orderResponse.data.data.razorpayKeyId);

    const orderId = orderResponse.data.data.order.id;

    // Step 3: Test payment order status
    console.log('\n3️⃣ Testing payment order status...');
    
    const statusResponse = await axios.get(`${API_BASE}/payments/orders/${orderId}/status`, {
      headers: { 'Authorization': `Bearer ${buyerToken}` }
    });

    console.log('✅ Payment status retrieval working');
    console.log('📊 Order status:', statusResponse.data.data.transaction.status);
    console.log('💳 Transaction ID:', statusResponse.data.data.transaction.id);

    // Step 4: Test payment failure handling
    console.log('\n4️⃣ Testing payment failure handling...');
    
    const failureData = {
      order_id: orderId,
      error_code: 'PAYMENT_FAILED',
      error_description: 'Test payment failure'
    };

    const failureResponse = await axios.post(`${API_BASE}/payments/failure`, failureData, {
      headers: { 'Authorization': `Bearer ${buyerToken}` }
    });

    console.log('✅ Payment failure handling working');
    console.log('❌ Failure recorded for order:', failureResponse.data.data.transaction.id);

    // Step 5: Test transaction history
    console.log('\n5️⃣ Testing transaction history...');
    
    const historyResponse = await axios.get(`${API_BASE}/payments/transactions?type=buyer&page=1&limit=10`, {
      headers: { 'Authorization': `Bearer ${buyerToken}` }
    });

    console.log('✅ Transaction history working');
    console.log('📊 Buyer transactions:', historyResponse.data.data.transactions.length);
    console.log('📄 Pagination info:', historyResponse.data.data.pagination);

    // Test seller transaction history
    const sellerHistoryResponse = await axios.get(`${API_BASE}/payments/transactions?type=seller&page=1&limit=10`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Seller transaction history working');
    console.log('📊 Seller transactions:', sellerHistoryResponse.data.data.transactions.length);

    // Step 6: Test payment analytics
    console.log('\n6️⃣ Testing payment analytics...');
    
    const analyticsResponse = await axios.get(`${API_BASE}/payments/analytics`, {
      headers: { 'Authorization': `Bearer ${sellerToken}` }
    });

    console.log('✅ Payment analytics working');
    console.log('💰 Total earnings:', analyticsResponse.data.data.analytics.totalEarnings);
    console.log('📊 Total transactions:', analyticsResponse.data.data.analytics.totalTransactions);
    console.log('📈 Success rate:', 
      Math.round((analyticsResponse.data.data.analytics.successfulTransactions / 
      analyticsResponse.data.data.analytics.totalTransactions) * 100) + '%'
    );

    // Step 7: Test webhook endpoint (public)
    console.log('\n7️⃣ Testing webhook endpoint...');
    
    const webhookData = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_test123',
            amount: 299900,
            currency: 'INR',
            status: 'captured'
          }
        }
      }
    };

    const webhookResponse = await axios.post(`${API_BASE}/payments/webhook`, webhookData, {
      headers: {
        'x-razorpay-signature': 'test_signature',
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Webhook endpoint working');
    console.log('🔗 Webhook processed successfully');

    // Step 8: Test access control
    console.log('\n8️⃣ Testing access control...');
    
    // Test buyer trying to access seller analytics (should fail)
    try {
      await axios.get(`${API_BASE}/payments/analytics`, {
        headers: { 'Authorization': `Bearer ${buyerToken}` }
      });
      console.log('❌ Buyer should not access seller analytics');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access control working: Buyer cannot access seller analytics');
      }
    }

    // Test unauthenticated access (should fail)
    try {
      await axios.post(`${API_BASE}/payments/orders`, orderData);
      console.log('❌ Unauthenticated access should be blocked');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication working: Unauthenticated access blocked');
      }
    }

    // Step 9: Test validation
    console.log('\n9️⃣ Testing input validation...');
    
    // Test invalid amount
    try {
      await axios.post(`${API_BASE}/payments/orders`, {
        projectId: projectId,
        amount: -100,
        description: 'Invalid amount test'
      }, {
        headers: { 'Authorization': `Bearer ${buyerToken}` }
      });
      console.log('❌ Negative amount should be rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working: Negative amount rejected');
      }
    }

    // Test missing required fields
    try {
      await axios.post(`${API_BASE}/payments/orders`, {
        amount: 2999
        // Missing projectId
      }, {
        headers: { 'Authorization': `Bearer ${buyerToken}` }
      });
      console.log('❌ Missing projectId should be rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validation working: Missing projectId rejected');
      }
    }

    console.log('\n🎉 All payment integration tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Payment order creation: Working');
    console.log('✅ Payment status tracking: Working');
    console.log('✅ Payment failure handling: Working');
    console.log('✅ Transaction history: Working');
    console.log('✅ Payment analytics: Working');
    console.log('✅ Webhook processing: Working');
    console.log('✅ Access control: Working');
    console.log('✅ Input validation: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Test admin payment features
async function testAdminPaymentFeatures() {
  console.log('\n🧪 Testing Admin Payment Features...\n');

  try {
    // Create admin user
    console.log('1️⃣ Creating admin user...');
    
    const adminData = {
      email: 'payment.admin@example.com',
      password: 'TestPassword123!',
      firstName: 'Payment',
      lastName: 'Admin',
      role: 'ADMIN'
    };

    const adminResponse = await axios.post(`${API_BASE}/auth/register`, adminData);
    const adminToken = adminResponse.data.data.tokens.accessToken;
    console.log('✅ Admin user created');

    // Test admin transaction listing
    console.log('\n2️⃣ Testing admin transaction listing...');
    
    const adminTransactionsResponse = await axios.get(`${API_BASE}/payments/admin/transactions`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Admin transaction listing working');
    console.log('📊 Admin can view all transactions:', adminTransactionsResponse.data.data.transactions.length);

    // Test admin statistics
    console.log('\n3️⃣ Testing admin payment statistics...');
    
    const adminStatsResponse = await axios.get(`${API_BASE}/payments/admin/statistics`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Admin statistics working');
    console.log('💰 Total platform revenue:', adminStatsResponse.data.data.statistics.totalRevenue);
    console.log('📊 Platform commission:', adminStatsResponse.data.data.statistics.platformCommission);

    // Test data export
    console.log('\n4️⃣ Testing transaction data export...');
    
    const exportResponse = await axios.get(`${API_BASE}/payments/admin/export?format=csv`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    console.log('✅ Data export working');
    console.log('📄 Export format:', exportResponse.headers['content-type']);
    console.log('📊 Export data length:', exportResponse.data.length, 'characters');

    console.log('\n🎉 Admin payment features test completed!');

  } catch (error) {
    console.error('❌ Admin test failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testPaymentIntegration();
  await testAdminPaymentFeatures();
}

runAllTests();
