// Simple test script for authentication endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing VibeCoder Authentication System...\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing user registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'BUYER'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('📧 User ID:', registerResponse.data.data.user.id);
    console.log('🔑 Access Token received:', registerResponse.data.data.tokens.accessToken ? 'Yes' : 'No');
    
    const accessToken = registerResponse.data.data.tokens.accessToken;
    const refreshToken = registerResponse.data.data.tokens.refreshToken;

    // Test 2: Login with the same user
    console.log('\n2️⃣ Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'TestPassword123!'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('🔑 New Access Token received:', loginResponse.data.data.tokens.accessToken ? 'Yes' : 'No');

    // Test 3: Get user profile (protected route)
    console.log('\n3️⃣ Testing protected route (get profile)...');
    const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.data.user.email);
    console.log('👤 User Role:', profileResponse.data.data.user.role);

    // Test 4: Refresh token
    console.log('\n4️⃣ Testing token refresh...');
    const refreshResponse = await axios.post(`${API_BASE}/auth/refresh-token`, {
      refreshToken: refreshToken
    });
    console.log('✅ Token refresh successful:', refreshResponse.data.message);
    console.log('🔑 New tokens received:', refreshResponse.data.data.tokens.accessToken ? 'Yes' : 'No');

    // Test 5: Logout
    console.log('\n5️⃣ Testing logout...');
    const logoutResponse = await axios.post(`${API_BASE}/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('✅ Logout successful:', logoutResponse.data.message);

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Run the test
testAuth();
