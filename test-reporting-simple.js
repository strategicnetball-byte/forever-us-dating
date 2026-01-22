#!/usr/bin/env node

/**
 * Simple Reporting System Test
 * Tests reporting endpoints directly
 */

const http = require('http');

const API_URL = 'http://18.141.201.176';

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing Reporting System\n');

  try {
    // Login
    console.log('1️⃣  Logging in...');
    let res = await makeRequest('POST', '/api/auth/login', {
      email: 'test@example.com',
      password: 'test123'
    });
    
    if (res.status !== 200) {
      console.log(`❌ Login failed: ${res.status}`);
      console.log(res.data);
      return;
    }
    
    const token = res.data.token;
    const userId = res.data.user._id;
    console.log(`✅ Logged in: ${res.data.user.email}`);
    console.log(`   User ID: ${userId}\n`);

    // Get users to report
    console.log('2️⃣  Getting users to report...');
    res = await makeRequest('GET', '/api/users/browse?limit=5', null, token);
    
    if (res.status !== 200 || !Array.isArray(res.data) || res.data.length === 0) {
      console.log(`❌ Failed to get users: ${res.status}`);
      console.log(res.data);
      return;
    }
    
    const targetUser = res.data[0];
    console.log(`✅ Found ${res.data.length} users`);
    console.log(`   Target: ${targetUser.profile.name} (${targetUser._id})\n`);

    // Submit report
    console.log('3️⃣  Submitting report...');
    res = await makeRequest('POST', '/api/reports/submit', {
      reportedUserId: targetUser._id,
      reportType: 'inappropriate-photos',
      description: 'Test report for inappropriate photos'
    }, token);
    
    if (res.status !== 201) {
      console.log(`❌ Report submission failed: ${res.status}`);
      console.log(res.data);
      return;
    }
    
    const reportId = res.data.reportId;
    console.log(`✅ Report submitted`);
    console.log(`   Report ID: ${reportId}\n`);

    // Get report details
    console.log('4️⃣  Getting report details...');
    res = await makeRequest('GET', `/api/reports/${reportId}`, null, token);
    
    if (res.status !== 200) {
      console.log(`❌ Failed to get report: ${res.status}`);
      console.log(res.data);
      return;
    }
    
    console.log(`✅ Report retrieved`);
    console.log(`   Status: ${res.data.status}`);
    console.log(`   Type: ${res.data.reportType}\n`);

    console.log('================================');
    console.log('✅ Reporting system is working!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
