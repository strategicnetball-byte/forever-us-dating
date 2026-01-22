const mongoose = require('mongoose');
const User = require('./server/models/User');

mongoose.connect('mongodb://localhost:27017/forever-us').then(() => {
  User.find({}).select('email profile.photos').then(users => {
    console.log('Total users:', users.length);
    users.forEach(u => {
      const photoCount = u.profile.photos ? u.profile.photos.length : 0;
      if (photoCount > 0) {
        console.log(`${u.email}: ${photoCount} photos`);
        console.log('  Photos:', u.profile.photos);
      }
    });
    process.exit(0);
  });
});
