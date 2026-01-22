const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

// Diverse photo URLs from Unsplash
const photoUrls = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507009335872-a72e6b9f5eb2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1519085360771-9852ef158dba?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf0?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1516214104703-3e8c82f1a9a7?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c006ae0f?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1500595046891-9b5c5b4d1b5f?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1506755855726-89d46e63b619?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'
];

const dummyProfiles = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@dummy.com',
    age: 28,
    gender: 'female',
    location: 'New York, NY',
    bio: 'Adventure seeker, coffee lover, and dog mom. Love hiking and trying new restaurants.',
    interests: ['Travel', 'Photography', 'Cooking', 'Hiking', 'Music'],
    tier: 'premium',
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
  {
    name: 'Jessica Martinez',
    email: 'jessica.martinez@dummy.com',
    age: 26,
    gender: 'female',
    location: 'Los Angeles, CA',
    bio: 'Yoga instructor and wellness enthusiast. Looking for someone to explore LA with.',
    interests: ['Fitness', 'Yoga', 'Travel', 'Art', 'Cooking'],
    tier: 'premium',
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
  {
    name: 'Amanda Chen',
    email: 'amanda.chen@dummy.com',
    age: 30,
    gender: 'female',
    location: 'San Francisco, CA',
    bio: 'Tech professional who loves outdoor activities. Weekend hiker and book lover.',
    interests: ['Technology', 'Hiking', 'Reading', 'Travel', 'Photography'],
    tier: 'vip',
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
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@dummy.com',
    age: 25,
    gender: 'female',
    location: 'Chicago, IL',
    bio: 'Artist and creative soul. Love museums, live music, and good conversations.',
    interests: ['Art', 'Music', 'Culture', 'Travel', 'Photography'],
    tier: 'premium',
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
  {
    name: 'Michelle Thompson',
    email: 'michelle.thompson@dummy.com',
    age: 29,
    gender: 'female',
    location: 'Boston, MA',
    bio: 'Marathon runner and fitness enthusiast. Love trying new restaurants and traveling.',
    interests: ['Sports', 'Fitness', 'Travel', 'Cooking', 'Music'],
    tier: 'premium',
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
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@dummy.com',
    age: 27,
    gender: 'female',
    location: 'Seattle, WA',
    bio: 'Coffee enthusiast and nature lover. Always up for a weekend adventure.',
    interests: ['Travel', 'Photography', 'Hiking', 'Cooking', 'Music'],
    tier: 'vip',
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
  {
    name: 'Rachel Green',
    email: 'rachel.green@dummy.com',
    age: 26,
    gender: 'female',
    location: 'Austin, TX',
    bio: 'Live music fan and foodie. Love exploring new neighborhoods and trying new cuisines.',
    interests: ['Music', 'Cooking', 'Travel', 'Art', 'Photography'],
    tier: 'premium',
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
  {
    name: 'Nicole White',
    email: 'nicole.white@dummy.com',
    age: 28,
    gender: 'female',
    location: 'Denver, CO',
    bio: 'Outdoor enthusiast and adventure seeker. Love skiing, hiking, and mountain life.',
    interests: ['Hiking', 'Sports', 'Travel', 'Photography', 'Fitness'],
    tier: 'premium',
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
];

async function createDummyUsersWithPhotos() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    let created = 0;

    for (const profile of dummyProfiles) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: profile.email });
      if (existingUser) {
        console.log(`⏭️  ${profile.name} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Assign 2-3 photos
      const photoCount = Math.floor(Math.random() * 2) + 2;
      const userPhotos = [];
      for (let i = 0; i < photoCount; i++) {
        const photoUrl = photoUrls[(created * 3 + i) % photoUrls.length];
        userPhotos.push(photoUrl);
      }

      // Create questionnaire responses
      const questionnaire = {
        values: ['Travel & exploration', 'Health & Wellness', 'Creativity & Arts'],
        lifestyle: ['Adventurous', 'Balanced', 'Active & outdoorsy'],
        relationshipGoal: 'Serious relationship',
        dealBreakers: 'Dishonesty and lack of respect - I value honesty and kindness',
        interests: profile.interests,
        communication: 'Deep conversations',
        finances: 'Balanced approach',
        health: 'Important - regular exercise',
        personality: ['Optimistic', 'Adventurous', 'Empathetic', 'Independent'],
        expectations: ['Honesty & trust', 'Sense of humor', 'Shared values'],
        completedAt: new Date()
      };

      // Create user
      const newUser = new User({
        email: profile.email,
        password: hashedPassword,
        profile: {
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          location: profile.location,
          bio: profile.bio,
          interests: profile.interests,
          photos: userPhotos,
          height: profile.height,
          eyeColor: profile.eyeColor,
          hairColor: profile.hairColor,
          bodyType: profile.bodyType,
          ethnicity: profile.ethnicity,
          occupation: profile.occupation,
          industry: profile.industry,
          education: profile.education,
          religion: profile.religion,
          zodiacSign: profile.zodiacSign,
          seekingRelationship: profile.seekingRelationship,
          conversationStarter: profile.conversationStarter,
          additionalInfo: profile.additionalInfo
        },
        membership: {
          tier: profile.tier,
          points: 100,
          earnedPoints: 100,
          actionPoints: 0
        },
        compatibility: {
          questionnaire: questionnaire,
          scores: []
        },
        isDummy: true,
        emailVerified: true
      });

      await newUser.save();
      console.log(`✅ Created ${profile.name} (${profile.email})`);
      console.log(`   Tier: ${profile.tier} | Photos: ${photoCount}`);
      created++;
    }

    console.log(`\n✅ Successfully created ${created} new dummy users with photos`);

    // List all dummy users
    const allDummyUsers = await User.find({
      $or: [
        { isDummy: true },
        { email: { $regex: 'dummy|test' } }
      ]
    });

    console.log(`\n📋 Total dummy/test users now: ${allDummyUsers.length}\n`);
    allDummyUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.profile.name} - ${user.profile.photos.length} photos`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

createDummyUsersWithPhotos();
