const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const questionnaireUpdates = {
  'sarah.johnson@dummy.com': {
    values: ['Travel & exploration', 'Health & Wellness', 'Creativity & Arts'],
    lifestyle: ['Adventurous', 'Balanced', 'Active & outdoorsy'],
    relationshipGoal: 'Serious relationship',
    dealBreakers: ['Dishonesty', 'Controlling behavior'],
    interests: ['Travel', 'Photography', 'Cooking', 'Hiking', 'Music'],
    communication: 'Deep conversations',
    finances: 'Balanced approach',
    health: 'Important - regular exercise',
    personality: ['Optimistic', 'Adventurous', 'Empathetic', 'Independent'],
    expectations: ['Honesty & trust', 'Sense of humor', 'Shared values'],
    completedAt: new Date()
  },
  'jessica.martinez@dummy.com': {
    values: ['Health & Wellness', 'Spirituality & Faith', 'Social Impact'],
    lifestyle: ['Balanced', 'Health-conscious'],
    relationshipGoal: 'Serious relationship',
    dealBreakers: ['Smoking', 'Heavy drinking'],
    interests: ['Fitness', 'Yoga', 'Travel', 'Art', 'Cooking'],
    communication: 'Deep conversations',
    finances: 'Balanced approach',
    health: 'Very important - I\'m very active',
    personality: ['Optimistic', 'Empathetic', 'Organized', 'Loyal'],
    expectations: ['Honesty & trust', 'Shared values', 'Emotional support'],
    completedAt: new Date()
  },
  'amanda.chen@dummy.com': {
    values: ['Career & Ambition', 'Learning & education', 'Financial Security'],
    lifestyle: ['Balanced', 'Structured & organized'],
    relationshipGoal: 'Serious relationship',
    dealBreakers: ['Dishonesty', 'No ambition'],
    interests: ['Technology', 'Hiking', 'Reading', 'Travel', 'Photography'],
    communication: 'Logical & analytical',
    finances: 'Save & invest',
    health: 'Important - regular exercise',
    personality: ['Ambitious', 'Independent', 'Organized', 'Intelligent'],
    expectations: ['Honesty & trust', 'Intelligence', 'Shared values'],
    completedAt: new Date()
  },
  'emily.rodriguez@dummy.com': {
    values: ['Creativity & Arts', 'Social Impact', 'Adventure & Travel'],
    lifestyle: ['Adventurous', 'Cultural & intellectual'],
    relationshipGoal: 'Serious relationship',
    dealBreakers: ['Dishonesty', 'Disrespectful'],
    interests: ['Art', 'Music', 'Culture', 'Travel', 'Photography'],
    communication: 'Deep conversations',
    finances: 'Balanced approach',
    health: 'Moderate - some activity',
    personality: ['Creative', 'Empathetic', 'Spontaneous', 'Adventurous'],
    expectations: ['Honesty & trust', 'Sense of humor', 'Emotional support'],
    completedAt: new Date()
  },
  'michelle.thompson@dummy.com': {
    values: ['Health & Wellness', 'Career & Ambition', 'Adventure & Travel'],
    lifestyle: ['Active & outdoorsy', 'Balanced'],
    relationshipGoal: 'Serious relationship',
    dealBreakers: ['Smoking', 'No ambition'],
    interests: ['Sports', 'Fitness', 'Travel', 'Cooking', 'Music'],
    communication: 'Direct & honest',
    finances: 'Balanced approach',
    health: 'Very important - I\'m very active',
    personality: ['Ambitious', 'Athletic', 'Organized', 'Loyal'],
    expectations: ['Honesty & trust', 'Shared values', 'Physical attraction'],
    completedAt: new Date()
  },
  'lisa.anderson@dummy.com': {
    values: ['Creativity & Arts', 'Adventure & Travel', 'Health & Wellness'],
    lifestyle: ['Adventurous', 'Balanced'],
    relationshipGoal: 'Serious relationship',
    dealBreakers: ['Dishonesty', 'Controlling behavior'],
    interests: ['Travel', 'Photography', 'Hiking', 'Cooking', 'Music'],
    communication: 'Deep conversations',
    finances: 'Balanced approach',
    health: 'Important - regular exercise',
    personality: ['Creative', 'Independent', 'Adventurous', 'Empathetic'],
    expectations: ['Honesty & trust', 'Sense of humor', 'Shared values'],
    completedAt: new Date()
  },
  'rachel.green@dummy.com': {
    values: ['Creativity & Arts', 'Social Impact', 'Adventure & Travel'],
    lifestyle: ['Social butterfly', 'Cultural & intellectual'],
    relationshipGoal: 'Serious relationship',
    dealBreakers: ['Dishonesty', 'Disrespectful'],
    interests: ['Music', 'Cooking', 'Travel', 'Art', 'Photography'],
    communication: 'Deep conversations',
    finances: 'Spend & enjoy',
    health: 'Moderate - some activity',
    personality: ['Creative', 'Social', 'Empathetic', 'Spontaneous'],
    expectations: ['Honesty & trust', 'Sense of humor', 'Emotional support'],
    completedAt: new Date()
  },
  'nicole.white@dummy.com': {
    values: ['Adventure & Travel', 'Health & Wellness', 'Career & Ambition'],
    lifestyle: ['Active & outdoorsy', 'Adventurous'],
    relationshipGoal: 'Serious relationship',
    dealBreakers: ['Smoking', 'No ambition'],
    interests: ['Hiking', 'Sports', 'Travel', 'Photography', 'Fitness'],
    communication: 'Direct & honest',
    finances: 'Balanced approach',
    health: 'Very important - I\'m very active',
    personality: ['Adventurous', 'Athletic', 'Independent', 'Loyal'],
    expectations: ['Honesty & trust', 'Shared values', 'Physical attraction'],
    completedAt: new Date()
  }
};

async function updateQuestionnaires() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    let updated = 0;

    for (const [email, questionnaire] of Object.entries(questionnaireUpdates)) {
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`❌ User not found: ${email}`);
        continue;
      }

      // Update questionnaire
      user.compatibility.questionnaire = questionnaire;
      await user.save();

      console.log(`✅ Updated questionnaire for ${user.profile.name}`);
      updated++;
    }

    console.log(`\n✅ Successfully updated ${updated} dummy users' questionnaires`);
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

updateQuestionnaires();
