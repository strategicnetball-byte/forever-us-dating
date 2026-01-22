const mongoose = require('mongoose');
const User = require('./server/models/User');

mongoose.connect('mongodb://localhost:27017/forever-us').then(() => {
  User.findOne({email: 'test@example.com'}).then(u => {
    console.log('Test user profile:');
    console.log('Email:', u.email);
    console.log('Name:', u.profile.name);
    console.log('Age:', u.profile.age);
    console.log('Gender:', u.profile.gender);
    console.log('Bio:', u.profile.bio);
    console.log('Photos:', u.profile.photos);
    console.log('Photos array length:', u.profile.photos ? u.profile.photos.length : 0);
    process.exit(0);
  });
});
