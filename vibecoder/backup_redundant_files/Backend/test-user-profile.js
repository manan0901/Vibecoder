// Test user profile management system
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testUserProfile() {
  console.log('🧪 Testing VibeCoder User Profile Management System...\n');

  try {
    // Step 1: Register a test user
    console.log('1️⃣ Registering test user...');
    const registerData = {
      email: 'profiletest@example.com',
      password: 'TestPassword123!',
      firstName: 'Profile',
      lastName: 'Tester',
      role: 'SELLER'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ User registered successfully');
    
    const accessToken = registerResponse.data.data.tokens.accessToken;
    const userId = registerResponse.data.data.user.id;

    // Step 2: Get current user profile
    console.log('\n2️⃣ Getting current user profile...');
    const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.data.user.email);

    // Step 3: Update user profile
    console.log('\n3️⃣ Updating user profile...');
    const updateData = {
      firstName: 'Updated',
      lastName: 'Profile',
      bio: 'This is my updated bio for testing purposes.',
      phone: '9876543210'
    };

    const updateResponse = await axios.put(`${API_BASE}/users/me/profile`, updateData, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Profile updated successfully');
    console.log('📝 New name:', updateResponse.data.data.user.firstName, updateResponse.data.data.user.lastName);
    console.log('📝 Bio:', updateResponse.data.data.user.bio);

    // Step 4: Get user statistics
    console.log('\n4️⃣ Getting user statistics...');
    const statsResponse = await axios.get(`${API_BASE}/users/me/stats`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Statistics retrieved successfully');
    console.log('📊 Projects:', statsResponse.data.data.stats.projects.total);
    console.log('📊 Downloads:', statsResponse.data.data.stats.projects.totalDownloads);

    // Step 5: Get user projects
    console.log('\n5️⃣ Getting user projects...');
    const projectsResponse = await axios.get(`${API_BASE}/users/me/projects`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Projects retrieved successfully');
    console.log('📦 Project count:', projectsResponse.data.data.projects.length);

    // Step 6: Get public user profile
    console.log('\n6️⃣ Getting public user profile...');
    const publicProfileResponse = await axios.get(`${API_BASE}/users/${userId}`);
    console.log('✅ Public profile retrieved successfully');
    console.log('👤 Public name:', publicProfileResponse.data.data.user.firstName, publicProfileResponse.data.data.user.lastName);

    // Step 7: Test user settings
    console.log('\n7️⃣ Testing user settings...');
    
    // Get current settings
    const settingsResponse = await axios.get(`${API_BASE}/settings`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Settings retrieved successfully');
    console.log('⚙️ Profile visibility:', settingsResponse.data.data.settings.profileVisibility);

    // Update settings
    const settingsUpdateData = {
      emailNotifications: false,
      profileVisibility: 'PRIVATE',
      language: 'hi',
      currency: 'INR'
    };

    const settingsUpdateResponse = await axios.put(`${API_BASE}/settings`, settingsUpdateData, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Settings updated successfully');
    console.log('⚙️ New visibility:', settingsUpdateResponse.data.data.settings.profileVisibility);

    // Step 8: Test notification settings
    console.log('\n8️⃣ Testing notification settings...');
    
    const notificationResponse = await axios.get(`${API_BASE}/settings/notifications`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Notification settings retrieved');
    console.log('📧 Email notifications enabled:', notificationResponse.data.data.notifications.email.newPurchase);

    // Update notification settings
    const notificationUpdateData = {
      email: {
        newPurchase: false,
        marketingEmails: true
      },
      push: {
        newSale: false
      }
    };

    const notificationUpdateResponse = await axios.put(`${API_BASE}/settings/notifications`, notificationUpdateData, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Notification settings updated');

    // Step 9: Test privacy settings
    console.log('\n9️⃣ Testing privacy settings...');
    
    const privacyResponse = await axios.get(`${API_BASE}/settings/privacy`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Privacy settings retrieved');
    console.log('🔒 Profile visibility:', privacyResponse.data.data.privacy.profileVisibility);

    // Update privacy settings
    const privacyUpdateData = {
      profileVisibility: 'PUBLIC',
      showEmail: true,
      allowDirectMessages: false
    };

    const privacyUpdateResponse = await axios.put(`${API_BASE}/settings/privacy`, privacyUpdateData, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Privacy settings updated');
    console.log('🔒 Show email:', privacyUpdateResponse.data.data.privacy.showEmail);

    console.log('\n🎉 All user profile management tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ User registration: Working');
    console.log('✅ Profile retrieval: Working');
    console.log('✅ Profile updates: Working');
    console.log('✅ User statistics: Working');
    console.log('✅ User projects: Working');
    console.log('✅ Public profiles: Working');
    console.log('✅ User settings: Working');
    console.log('✅ Notification settings: Working');
    console.log('✅ Privacy settings: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data?.stack) {
      console.error('Stack trace:', error.response.data.stack);
    }
  }
}

// Run the test
testUserProfile();
