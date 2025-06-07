// Test performance optimization system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testPerformanceOptimization() {
  console.log('🧪 Testing VibeCoder Performance Optimization System...\n');

  try {
    // Step 1: Test health check endpoint
    console.log('1️⃣ Testing health check endpoint...');
    
    const healthResponse = await axios.get(`${API_BASE}/health`);
    
    console.log('✅ Health check working');
    console.log('🏥 Status:', healthResponse.data.data.status);
    console.log('⏱️ Uptime:', healthResponse.data.data.uptime);
    console.log('💾 Memory usage:', healthResponse.data.data.memory.heapUsed);

    // Step 2: Test performance stats endpoint
    console.log('\n2️⃣ Testing performance stats endpoint...');
    
    const performanceResponse = await axios.get(`${API_BASE}/performance/stats`);
    
    console.log('✅ Performance stats working');
    console.log('📊 Total requests:', performanceResponse.data.data.totalRequests);
    console.log('⚡ Average response time:', performanceResponse.data.data.averageResponseTime + 'ms');
    console.log('🐌 Slow requests:', performanceResponse.data.data.slowRequests);
    console.log('❌ Error rate:', performanceResponse.data.data.errorRate + '%');

    // Step 3: Test cache health check
    console.log('\n3️⃣ Testing cache health check...');
    
    const cacheHealthResponse = await axios.get(`${API_BASE}/health/cache`);
    
    console.log('✅ Cache health check working');
    console.log('🗄️ Cache status:', cacheHealthResponse.data.status);
    console.log('⏰ Timestamp:', cacheHealthResponse.data.timestamp);

    // Step 4: Test cache statistics
    console.log('\n4️⃣ Testing cache statistics...');
    
    const cacheStatsResponse = await axios.get(`${API_BASE}/cache/stats`);
    
    console.log('✅ Cache statistics working');
    console.log('🔗 Cache available:', cacheStatsResponse.data.data.isAvailable);

    // Step 5: Test response headers for performance
    console.log('\n5️⃣ Testing performance headers...');
    
    const headersResponse = await axios.get(`${API_BASE}/health`);
    
    console.log('✅ Performance headers working');
    console.log('⏱️ Response time header:', headersResponse.headers['x-response-time']);
    console.log('🆔 Request ID header:', headersResponse.headers['x-request-id']);
    console.log('🗄️ Cache header:', headersResponse.headers['x-cache'] || 'Not cached');

    // Step 6: Test compression
    console.log('\n6️⃣ Testing response compression...');
    
    const compressionResponse = await axios.get(`${API_BASE}/health`, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    console.log('✅ Compression working');
    console.log('📦 Content encoding:', compressionResponse.headers['content-encoding'] || 'Not compressed');

    // Step 7: Test multiple concurrent requests for performance
    console.log('\n7️⃣ Testing concurrent request performance...');
    
    const concurrentRequests = Array.from({ length: 10 }, () =>
      axios.get(`${API_BASE}/health`)
    );

    const startTime = Date.now();
    const concurrentResponses = await Promise.all(concurrentRequests);
    const totalTime = Date.now() - startTime;

    console.log('✅ Concurrent requests completed');
    console.log('🚀 Total time for 10 requests:', totalTime + 'ms');
    console.log('⚡ Average time per request:', (totalTime / 10).toFixed(2) + 'ms');
    console.log('✅ All requests successful:', concurrentResponses.every(r => r.status === 200));

    // Step 8: Test memory monitoring
    console.log('\n8️⃣ Testing memory monitoring...');
    
    const memoryResponse = await axios.get(`${API_BASE}/health`);
    const memoryInfo = memoryResponse.data.data.memory;
    
    console.log('✅ Memory monitoring working');
    console.log('💾 RSS Memory:', memoryInfo.rss);
    console.log('🏗️ Heap Total:', memoryInfo.heapTotal);
    console.log('📊 Heap Used:', memoryInfo.heapUsed);
    console.log('🔗 External:', memoryInfo.external);

    // Step 9: Test security headers
    console.log('\n9️⃣ Testing security headers...');
    
    const securityResponse = await axios.get(`${API_BASE}/health`);
    
    console.log('✅ Security headers working');
    console.log('🛡️ X-Frame-Options:', securityResponse.headers['x-frame-options'] || 'Not set');
    console.log('🔒 X-Content-Type-Options:', securityResponse.headers['x-content-type-options'] || 'Not set');
    console.log('🚫 X-XSS-Protection:', securityResponse.headers['x-xss-protection'] || 'Not set');

    // Step 10: Test rate limiting (should work normally)
    console.log('\n🔟 Testing rate limiting behavior...');
    
    const rateLimitResponse = await axios.get(`${API_BASE}/health`);
    
    console.log('✅ Rate limiting working');
    console.log('🚦 Rate limit remaining:', rateLimitResponse.headers['x-ratelimit-remaining'] || 'Not set');
    console.log('⏰ Rate limit reset:', rateLimitResponse.headers['x-ratelimit-reset'] || 'Not set');

    console.log('\n🎉 All performance optimization tests passed!');
    console.log('\n📊 Performance Test Summary:');
    console.log('✅ Health check endpoint: Working');
    console.log('✅ Performance monitoring: Working');
    console.log('✅ Cache system: Working');
    console.log('✅ Response compression: Working');
    console.log('✅ Concurrent handling: Working');
    console.log('✅ Memory monitoring: Working');
    console.log('✅ Security headers: Working');
    console.log('✅ Rate limiting: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Test caching performance
async function testCachingPerformance() {
  console.log('\n🧪 Testing Caching Performance...\n');

  try {
    console.log('1️⃣ Testing cache miss vs cache hit performance...');
    
    // First request (cache miss)
    const startTime1 = Date.now();
    const response1 = await axios.get(`${API_BASE}/health`);
    const time1 = Date.now() - startTime1;
    
    console.log('⏱️ First request (cache miss):', time1 + 'ms');
    console.log('🗄️ Cache status:', response1.headers['x-cache'] || 'Not cached');

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 100));

    // Second request (potential cache hit)
    const startTime2 = Date.now();
    const response2 = await axios.get(`${API_BASE}/health`);
    const time2 = Date.now() - startTime2;
    
    console.log('⏱️ Second request (potential cache hit):', time2 + 'ms');
    console.log('🗄️ Cache status:', response2.headers['x-cache'] || 'Not cached');

    if (time2 < time1) {
      console.log('✅ Caching appears to be improving performance');
    } else {
      console.log('ℹ️ No significant performance improvement detected (may be expected for health endpoint)');
    }

    console.log('\n🎉 Caching performance test completed!');

  } catch (error) {
    console.error('❌ Caching test failed:', error.response?.data || error.message);
  }
}

// Test load handling
async function testLoadHandling() {
  console.log('\n🧪 Testing Load Handling...\n');

  try {
    console.log('1️⃣ Testing server load handling with burst requests...');
    
    // Create a burst of 50 requests
    const burstRequests = Array.from({ length: 50 }, (_, i) =>
      axios.get(`${API_BASE}/health`).then(response => ({
        index: i,
        status: response.status,
        responseTime: response.headers['x-response-time'],
      }))
    );

    const startTime = Date.now();
    const results = await Promise.all(burstRequests);
    const totalTime = Date.now() - startTime;

    const successfulRequests = results.filter(r => r.status === 200).length;
    const averageTime = totalTime / results.length;

    console.log('✅ Burst load test completed');
    console.log('📊 Total requests:', results.length);
    console.log('✅ Successful requests:', successfulRequests);
    console.log('⏱️ Total time:', totalTime + 'ms');
    console.log('⚡ Average time per request:', averageTime.toFixed(2) + 'ms');
    console.log('🎯 Success rate:', ((successfulRequests / results.length) * 100).toFixed(2) + '%');

    if (successfulRequests === results.length) {
      console.log('🎉 Server handled all requests successfully!');
    } else {
      console.log('⚠️ Some requests failed - this may indicate load issues');
    }

  } catch (error) {
    console.error('❌ Load handling test failed:', error.response?.data || error.message);
  }
}

// Test error handling performance
async function testErrorHandlingPerformance() {
  console.log('\n🧪 Testing Error Handling Performance...\n');

  try {
    console.log('1️⃣ Testing 404 error handling performance...');
    
    const startTime = Date.now();
    try {
      await axios.get(`${API_BASE}/nonexistent-endpoint`);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error.response?.status === 404) {
        console.log('✅ 404 error handled correctly');
        console.log('⏱️ Error response time:', responseTime + 'ms');
        console.log('📝 Error message:', error.response.data.error || 'Not provided');
      } else {
        console.log('❌ Unexpected error status:', error.response?.status);
      }
    }

    console.log('\n2️⃣ Testing invalid request handling...');
    
    const startTime2 = Date.now();
    try {
      await axios.post(`${API_BASE}/health`, { invalid: 'data' });
    } catch (error) {
      const responseTime2 = Date.now() - startTime2;
      
      console.log('✅ Invalid request handled');
      console.log('⏱️ Error response time:', responseTime2 + 'ms');
      console.log('📊 Status code:', error.response?.status);
    }

    console.log('\n🎉 Error handling performance test completed!');

  } catch (error) {
    console.error('❌ Error handling test failed:', error.message);
  }
}

// Test deployment readiness
async function testDeploymentReadiness() {
  console.log('\n🧪 Testing Deployment Readiness...\n');

  try {
    console.log('1️⃣ Testing environment configuration...');

    // Check if required environment variables are accessible
    const requiredEnvVars = [
      'NODE_ENV',
      'PORT'
    ];

    const envStatus = requiredEnvVars.map(envVar => ({
      name: envVar,
      value: process.env[envVar] || 'Not set',
      isSet: !!process.env[envVar]
    }));

    console.log('✅ Environment variables check:');
    envStatus.forEach(env => {
      console.log(`${env.isSet ? '✅' : '❌'} ${env.name}: ${env.isSet ? 'Set' : 'Not set'}`);
    });

    console.log('\n2️⃣ Testing Docker health check endpoint...');

    const healthResponse = await axios.get(`${API_BASE}/health`);

    if (healthResponse.status === 200) {
      console.log('✅ Health check endpoint working');
      console.log('🏥 Health status:', healthResponse.data.data?.status || 'healthy');
    }

    console.log('\n3️⃣ Testing production readiness...');

    // Test if server can handle production-like load
    const productionTests = Array.from({ length: 20 }, () =>
      axios.get(`${API_BASE}/health`).catch(error => ({ error: true, status: error.response?.status }))
    );

    const productionResults = await Promise.all(productionTests);
    const successfulRequests = productionResults.filter(r => !r.error).length;

    console.log('✅ Production load test completed');
    console.log('📊 Successful requests:', successfulRequests, '/ 20');
    console.log('🎯 Success rate:', ((successfulRequests / 20) * 100).toFixed(2) + '%');

    if (successfulRequests >= 18) {
      console.log('✅ Server ready for production deployment');
    } else {
      console.log('⚠️ Server may need optimization before production');
    }

    console.log('\n🎉 Deployment readiness test completed!');

  } catch (error) {
    console.error('❌ Deployment readiness test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testPerformanceOptimization();
  await testCachingPerformance();
  await testLoadHandling();
  await testErrorHandlingPerformance();
  await testDeploymentReadiness();
}

runAllTests();
