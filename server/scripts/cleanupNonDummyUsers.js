const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cleanup = async () => {
  try {
    console.log('🧹 Cleaning up non-dummy users...\n');
    
    // Count before
    const totalBefore = await User.countDocuments();
    const dummyBefore = await User.countDocuments({ email: { $regex: /@example\.com$/ } });
    const realBefore = totalBefore - dummyBefore;
    
    console.log('📊 Before cleanup:');
    console.log(`   Total users: ${totalBefore}`);
    console.log(`   Dummy profiles: ${dummyBefore}`);
    console.log(`   Real users: ${realBefore}`);
    
    // Delete all non-dummy users
    const result = await User.deleteMany({ email: { $not: { $regex: /@example\.com$/ } } });
    
    console.log(`\n✅ Deleted ${result.deletedCount} non-dummy users`);
    
    // Count after
    const totalAfter = await User.countDocuments();
    const dummyAfter = await User.countDocuments({ email: { $regex: /@example\.com$/ } });
    
    console.log('\n📊 After cleanup:');
    console.log(`   Total users: ${totalAfter}`);
    console.log(`   Dummy profiles: ${dummyAfter}`);
    
    console.log('\n🎉 Cleanup complete!');
    console.log('💡 Now run: node server/scripts/setupTestEnvironment.js');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
};

cleanup();
