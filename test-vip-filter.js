const axios = require('axios');

// Test VIP score filter endpoint
async function testScoreFilter() {
  try {
    // First get a valid token by logging in
    const loginRes = await axios.post('http://3.0.99.28/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Logged in, token:', token.substring(0, 20) + '...');
    
    // Test PUT score filter
    console.log('\n📤 Testing PUT /api/compatibility/score-filter...');
    const putRes = await axios.put('http://3.0.99.28/api/compatibility/score-filter', {
      minScore: 40,
      maxScore: 90
    }, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    
    console.log('✅ PUT Response:', putRes.data);
    
    // Test GET score filter
    console.log('\n📥 Testing GET /api/compatibility/score-filter...');
    const getRes = await axios.get('http://3.0.99.28/api/compatibility/score-filter', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    
    console.log('✅ GET Response:', getRes.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testScoreFilter();
