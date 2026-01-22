const axios = require('axios');

const testUserId = '6958c16bff16a573e3f631f9'; // Test User ID

axios.get('http://3.0.99.28:5000/api/users/' + testUserId, {
  headers: { 'Authorization': 'Bearer test-token' }
})
.then(res => {
  console.log('✅ User found:', res.data.profile.name);
  console.log('   Photos:', res.data.profile.photos?.length || 0);
  console.log('   Height:', res.data.profile.height);
})
.catch(err => {
  console.log('❌ Error:', err.response?.status, err.response?.data?.message || err.message);
});
