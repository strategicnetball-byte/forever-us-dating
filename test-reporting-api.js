#!/usr/bin/env node

/**
 * Test Reporting System API
 * Tests all reporting endpoints
 */

const http = require('http');

const API_URL = 'http://18.141.201.176';
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'test123';

let authToken = '';
let testUserId = '';
let dummyUserId = '';
let reportId = '';

function makeRequest(method, path, body = null) {
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

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
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

async function runTests() {
  console.log('🧪 Testing Reporting System API\n');
  console.log('================================\n');

  try {
    // Step 1: Login
    console.log('1️⃣  Logging in...');
    let res = await makeRequest('POST', '/api/auth/login', {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    });
    
    if (res.status !== 200) {
      throw new Error(`Login failed: ${res.status}`);
    }
    
    authToken = res.data.token;
    testUserId = res.data.user._id;
    console.log(`✅ Logged in as: ${res.data.user.email}`);
    console.log(`   User ID: ${testUserId}\n`);

    // Step 2: Get a dummy user to report
    console.log('2️⃣  Finding a user to report...');
    res = await makeRequest('GET', '/api/users/browse?limit=1');
    
    if (res.status !== 200 || !res.data.users || res.data.users.length === 0) {
      throw new Error('No users found to report');
    }
    
    dummyUserId = res.data.users[0]._id;
    console.log(`✅ Found user: ${res.data.users[0].profile.name}`);
    console.log(`   User ID: ${dummyUserId}\n`);

    // Step 3: Submit a report
    console.log('3️⃣  Submitting a report...');
    res = await makeRequest('POST', '/api/reports/submit', {
      reportedUserId: dummyUserId,
      reportType: 'inappropriate-photos',
      description: 'This user has inappropriate photos in their profile that violate community guidelines.'
    });
    
    if (res.status !== 201) {
      throw new Error(`Report submission failed: ${res.status}`);
    }
    
    reportId = res.data.reportId;
    console.log(`✅ Report submitted successfully`);
    console.log(`   Report ID: ${reportId}\n`);

    // Step 4: Get report details
    console.log('4️⃣  Retrieving report details...');
    res = await makeRequest('GET', `/api/reports/${reportId}`);
    
    if (res.status !== 200) {
      throw new Error(`Failed to get report: ${res.status}`);
    }
    
    console.log(`✅ Report retrieved`);
    console.log(`   Status: ${res.data.status}`);
    console.log(`   Type: ${res.data.reportType}`);
    console.log(`   Description: ${res.data.description}\n`);

    // Step 5: Get pending reports
    console.log('5️⃣  Getting all pending reports...');
    res = await makeRequest('GET', '/api/reports/admin/pending');
    
    if (res.status !== 200) {
      throw new Error(`Failed to get pending reports: ${res.status}`);
    }
    
    console.log(`✅ Found ${res.data.length} pending reports\n`);

    // Step 6: Update report status
    console.log('6️⃣  Updating report status to "under-review"...');
    res = await makeRequest('PUT', `/api/reports/${reportId}/status`, {
      status: 'under-review'
    });
    
    if (res.status !== 200) {
      throw new Error(`Failed to update status: ${res.status}`);
    }
    
    console.log(`✅ Report status updated to: ${res.data.status}\n`);

    // Step 7: Resolve report with action
    console.log('7️⃣  Resolving report with warning action...');
    res = await makeRequest('PUT', `/api/reports/${reportId}/resolve`, {
      action: 'warning',
      notes: 'User warned for inappropriate photos. First offense.'
    });
    
    if (res.status !== 200) {
      throw new Error(`Failed to resolve report: ${res.status}`);
    }
    
    console.log(`✅ Report resolved`);
    console.log(`   Action: ${res.data.report.resolution.action}`);
    console.log(`   Notes: ${res.data.report.resolution.notes}\n`);

    // Step 8: Get user report history
    console.log('8️⃣  Getting report history for reported user...');
    res = await makeRequest('GET', `/api/reports/user/${dummyUserId}/history`);
    
    if (res.status !== 200) {
      throw new Error(`Failed to get report history: ${res.status}`);
    }
    
    console.log(`✅ Found ${res.data.length} reports against this user\n`);

    // Step 9: Get statistics
    console.log('9️⃣  Getting reporting statistics...');
    res = await makeRequest('GET', '/api/reports/admin/stats');
    
    if (res.status !== 200) {
      throw new Error(`Failed to get stats: ${res.status}`);
    }
    
    console.log(`✅ Reporting Statistics:`);
    console.log(`   Total reports: ${res.data.total}`);
    console.log(`   Pending: ${res.data.pending}`);
    console.log(`   Under review: ${res.data.underReview}`);
    console.log(`   Resolved: ${res.data.resolved}`);
    console.log(`   Dismissed: ${res.data.dismissed}\n`);

    console.log('================================');
    console.log('✅ All tests passed!\n');
    console.log('The reporting system is fully functional.');
    console.log('Users can submit reports, and admins can manage them.\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
