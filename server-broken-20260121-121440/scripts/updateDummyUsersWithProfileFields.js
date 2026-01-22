const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const profileUpdates = {
  'sarah.johnson@dummy.com': {
    height: "5'6\"",
    eyeColor: 'Blue',
    hairColor: 'Blonde',
    bodyType: 'Athletic',
    ethnicity: 'Caucasian',
    occupation: 'Graphic Designer',
    industry: 'Creative',
    education: "Bachelor's",
    religion: 'Christian',
    zodiacSign: 'Gemini',
    seekingRelationship: 'Serious',
    conversationStarter: 'What\'s your favorite travel destination?',
    additionalInfo: 'I love exploring new places and trying different cuisines. Always up for spontaneous adventures!'
  },
  'jessica.martinez@dummy.com': {
    height: "5'4\"",
    eyeColor: 'Brown',
    hairColor: 'Black',
    bodyType: 'Slim',
    ethnicity: 'Hispanic',
    occupation: 'Yoga Instructor',
    industry: 'Wellness',
    education: "Bachelor's",
    religion: 'Spiritual',
    zodiacSign: 'Libra',
    seekingRelationship: 'Serious',
    conversationStarter: 'Do you have a morning routine?',
    additionalInfo: 'Passionate about health and wellness. Love connecting with people who value personal growth.'
  },
  'amanda.chen@dummy.com': {
    height: "5'5\"",
    eyeColor: 'Brown',
    hairColor: 'Black',
    bodyType: 'Average',
    ethnicity: 'Asian',
    occupation: 'Software Engineer',
    industry: 'Technology',
    education: "Master's",
    religion: 'Agnostic',
    zodiacSign: 'Capricorn',
    seekingRelationship: 'Serious',
    conversationStarter: 'What\'s the best book you\'ve read recently?',
    additionalInfo: 'Tech enthusiast by day, nature lover by weekend. Looking for someone who appreciates both.'
  },
  'emily.rodriguez@dummy.com': {
    height: "5'7\"",
    eyeColor: 'Green',
    hairColor: 'Brown',
    bodyType: 'Curvy',
    ethnicity: 'Hispanic',
    occupation: 'Artist',
    industry: 'Creative',
    education: "Bachelor's",
    religion: 'Catholic',
    zodiacSign: 'Pisces',
    seekingRelationship: 'Serious',
    conversationStarter: 'What\'s your favorite art form?',
    additionalInfo: 'Creative and passionate about life. Love deep conversations and exploring new cultures.'
  },
  'michelle.thompson@dummy.com': {
    height: "5'8\"",
    eyeColor: 'Hazel',
    hairColor: 'Red',
    bodyType: 'Athletic',
    ethnicity: 'Caucasian',
    occupation: 'Personal Trainer',
    industry: 'Fitness',
    education: "Bachelor's",
    religion: 'Protestant',
    zodiacSign: 'Aries',
    seekingRelationship: 'Serious',
    conversationStarter: 'Do you have a favorite workout?',
    additionalInfo: 'Fitness is my passion, but I also love good food and travel. Balance is key!'
  },
  'lisa.anderson@dummy.com': {
    height: "5'3\"",
    eyeColor: 'Blue',
    hairColor: 'Blonde',
    bodyType: 'Slim',
    ethnicity: 'Caucasian',
    occupation: 'Photographer',
    industry: 'Creative',
    education: "Bachelor's",
    religion: 'Atheist',
    zodiacSign: 'Taurus',
    seekingRelationship: 'Serious',
    conversationStarter: 'What\'s your favorite coffee order?',
    additionalInfo: 'Coffee addict and nature photographer. Love capturing moments and creating memories.'
  },
  'rachel.green@dummy.com': {
    height: "5'6\"",
    eyeColor: 'Brown',
    hairColor: 'Brown',
    bodyType: 'Average',
    ethnicity: 'Caucasian',
    occupation: 'Chef',
    industry: 'Food & Beverage',
    education: "Culinary School",
    religion: 'Jewish',
    zodiacSign: 'Virgo',
    seekingRelationship: 'Serious',
    conversationStarter: 'What\'s your favorite cuisine?',
    additionalInfo: 'Passionate about food and music. Love discovering new restaurants and live venues.'
  },
  'nicole.white@dummy.com': {
    height: "5'9\"",
    eyeColor: 'Green',
    hairColor: 'Blonde',
    bodyType: 'Athletic',
    ethnicity: 'Caucasian',
    occupation: 'Mountain Guide',
    industry: 'Tourism',
    education: "High School",
    religion: 'Christian',
    zodiacSign: 'Sagittarius',
    seekingRelationship: 'Serious',
    conversationStarter: 'What\'s your favorite outdoor activity?',
    additionalInfo: 'Mountain life is my passion. Looking for someone who loves adventure and the outdoors.'
  }
};

async function updateDummyUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;

    for (const [email, updates] of Object.entries(profileUpdates)) {
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`❌ User not found: ${email}`);
        continue;
      }

      // Update profile fields
      Object.assign(user.profile, updates);
      await user.save();

      console.log(`✅ Updated ${user.profile.name}`);
      updated++;
    }

    console.log(`\n✅ Successfully updated ${updated} dummy users with profile fields`);
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

updateDummyUsers();
