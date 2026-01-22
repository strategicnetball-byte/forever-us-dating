const http = require('http');
const path = require('path');

// Test if images are accessible via the server
const imageFile = 'uploads/photos/696478225936101bbade328c-1768194430885-272535275.jpg';
const imageUrl = `http://localhost:3001/uploads/photos/696478225936101bbade328c-1768194430885-272535275.jpg`;

console.log('Testing image accessibility...');
console.log('Image URL:', imageUrl);

http.get(imageUrl, (res) => {
  console.log('✅ Image accessible!');
  console.log('Status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Content-Length:', res.headers['content-length']);
  
  if (res.statusCode === 200) {
    console.log('✅ Image is being served correctly');
  } else {
    console.log('❌ Unexpected status code:', res.statusCode);
  }
}).on('error', (err) => {
  console.error('❌ Error accessing image:', err.message);
});
