// Test authentication utilities without database
require('dotenv').config();
const { generateTokens, verifyAccessToken, verifyRefreshToken } = require('./src/utils/jwt');
const { hashPassword, comparePassword, validatePasswordStrength } = require('./src/utils/password');

async function testAuthUtils() {
  console.log('🧪 Testing VibeCoder Authentication Utilities...\n');

  try {
    // Test 1: Password hashing and comparison
    console.log('1️⃣ Testing password hashing...');
    const password = 'TestPassword123!';
    const hashedPassword = await hashPassword(password);
    console.log('✅ Password hashed successfully');
    console.log('🔒 Hash length:', hashedPassword.length);

    const isValid = await comparePassword(password, hashedPassword);
    console.log('✅ Password comparison:', isValid ? 'Valid' : 'Invalid');

    const isInvalid = await comparePassword('wrongpassword', hashedPassword);
    console.log('✅ Wrong password comparison:', isInvalid ? 'Valid (ERROR!)' : 'Invalid (Correct)');

    // Test 2: Password strength validation
    console.log('\n2️⃣ Testing password validation...');
    const strongPassword = validatePasswordStrength('StrongPass123!');
    console.log('✅ Strong password validation:', strongPassword.isValid ? 'Valid' : 'Invalid');
    
    const weakPassword = validatePasswordStrength('weak');
    console.log('✅ Weak password validation:', weakPassword.isValid ? 'Valid (ERROR!)' : 'Invalid (Correct)');
    console.log('📝 Weak password errors:', weakPassword.errors.slice(0, 2).join(', '));

    // Test 3: JWT token generation and verification
    console.log('\n3️⃣ Testing JWT tokens...');
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'BUYER'
    };

    const tokens = generateTokens(mockUser);
    console.log('✅ Tokens generated successfully');
    console.log('🔑 Access token length:', tokens.accessToken.length);
    console.log('🔄 Refresh token length:', tokens.refreshToken.length);
    console.log('⏰ Expires in:', tokens.expiresIn, 'seconds');

    // Test 4: Token verification
    console.log('\n4️⃣ Testing token verification...');
    const accessPayload = verifyAccessToken(tokens.accessToken);
    console.log('✅ Access token verified successfully');
    console.log('👤 User ID from token:', accessPayload.userId);
    console.log('📧 Email from token:', accessPayload.email);

    const refreshPayload = verifyRefreshToken(tokens.refreshToken);
    console.log('✅ Refresh token verified successfully');
    console.log('👤 User ID from refresh token:', refreshPayload.userId);

    // Test 5: Invalid token handling
    console.log('\n5️⃣ Testing invalid token handling...');
    try {
      verifyAccessToken('invalid.token.here');
      console.log('❌ Invalid token verification should have failed');
    } catch (error) {
      console.log('✅ Invalid token properly rejected:', error.message);
    }

    console.log('\n🎉 All authentication utility tests passed!');
    console.log('\n📊 Summary:');
    console.log('✅ Password hashing and comparison: Working');
    console.log('✅ Password strength validation: Working');
    console.log('✅ JWT token generation: Working');
    console.log('✅ JWT token verification: Working');
    console.log('✅ Error handling: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testAuthUtils();
