const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Load .env from the root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forever-us';

async function checkEndpoint() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find a user
    const user = await User.findOne();
    
    if (!user) {
      console.log('No user found');
      return;
    }

    // Create a token with the correct secret
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    console.log('\n=== Making request to /api/rewards/opportunities ===');
    console.log('Using JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not set');
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/rewards/opportunities',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('\nResponse received:');
          console.log('Status:', res.statusCode);
          console.log('Video Ads:', json.videoAds?.length || 0);
          console.log('Surveys:', json.surveys?.length || 0);
          console.log('Offers:', json.offers?.length || 0);
          
          if (json.surveys && json.surveys.length > 0) {
            console.log('\nFirst survey type:', json.surveys[0].type);
            console.log('First survey:', JSON.stringify(json.surveys[0], null, 2));
          } else {
            console.log('\n⚠️ No surveys in response!');
          }
        } catch (e) {
          console.error('Failed to parse response:', e.message);
          console.log('Raw response:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
    });

    req.end();

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    setTimeout(() => {
      mongoose.disconnect();
    }, 1000);
  }
}

checkEndpoint();
