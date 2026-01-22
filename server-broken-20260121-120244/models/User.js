const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'genderqueer', 'transgender-male', 'transgender-female', 'prefer-not-to-say'],
      required: true
    },
    lookingFor: [{
      type: String,
      enum: ['male', 'female', 'non-binary', 'genderqueer', 'transgender-male', 'transgender-female']
    }],
    bio: { type: String, maxlength: 500 },
    photos: [{ type: String }],
    interests: [{ type: String }],
    location: { type: String },
    coordinates: {
      lat: Number,
      lng: Number
    },
    // Physical attributes
    height: { type: String }, // e.g., "5'10"", "178cm"
    eyeColor: { type: String }, // e.g., "Blue", "Brown", "Green"
    hairColor: { type: String }, // e.g., "Blonde", "Brown", "Black"
    bodyType: { type: String }, // e.g., "Athletic", "Average", "Curvy", "Slim"
    ethnicity: { type: String }, // e.g., "Caucasian", "Hispanic", "Asian", "African American"
    // Professional
    occupation: { type: String }, // e.g., "Software Engineer", "Teacher"
    industry: { type: String }, // e.g., "Technology", "Retail", "Management", "Healthcare"
    education: { type: String }, // e.g., "High School", "Bachelor's", "Master's", "PhD"
    // Personal
    religion: { type: String }, // e.g., "Christian", "Jewish", "Muslim", "Atheist"
    zodiacSign: { type: String }, // e.g., "Aries", "Taurus", "Gemini"
    // Relationship seeking
    seekingRelationship: { type: String }, // e.g., "Serious", "Casual", "Not Sure"
    // Additional info
    conversationStarter: { type: String, maxlength: 200 }, // Fun fact or icebreaker
    additionalInfo: { type: String, maxlength: 1000 } // Free text bio
  },
  membership: {
    tier: { 
      type: String, 
      enum: ['free', 'premium', 'vip'], 
      default: 'free' 
    },
    points: { type: Number, default: 100 }, // Action points (likes, messages, etc.)
    earnedPoints: { type: Number, default: 0 }, // Points earned through activities (for giveaways, bonuses)
    subscriptionId: String, // For payment tracking
    subscriptionEnd: Date,
    isActive: { type: Boolean, default: true }
  },
  preferences: {
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 99 }
    },
    maxDistance: { type: Number, default: 50 }
  },
  compatibility: {
    questionnaire: {
      values: [{ type: String }], // Array of values
      lifestyle: [{ type: String }], // Array of lifestyles
      relationshipGoal: { type: String }, // Single select
      dealBreakers: [{ type: String }], // Array of deal breakers
      interests: [{ type: String }],
      completedAt: { type: Date }
    },
    scores: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, min: 0, max: 100 }, // Compatibility percentage
        calculatedAt: { type: Date, default: Date.now }
      }
    ],
    // Score filter preferences (VIP only)
    scoreFilter: {
      minScore: { type: Number, min: 0, max: 100, default: 0 },
      maxScore: { type: Number, min: 0, max: 100, default: 100 }
    }
  },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likedAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date } // Track last message exchange with this user
  }],
  passes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now },
  lastDailyBonus: { type: Date },
  lastWeeklyBonus: { type: Date },
  dailyEarningsToday: { type: Number, default: 0 },
  lastEarningsReset: { type: Date, default: Date.now },
  passwordReset: {
    code: { type: String },
    expiresAt: { type: Date }
  },
  emailVerification: {
    code: { type: String },
    expiresAt: { type: Date }
  },
  emailVerified: { type: Boolean, default: false },
  settings: {
    notifications: {
      emailOnMatch: { type: Boolean, default: true },
      emailOnMessage: { type: Boolean, default: true },
      emailOnLike: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true }
    },
    privacy: {
      showOnlineStatus: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
      showProfile: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to check if user can perform action based on points/tier
userSchema.methods.canPerformAction = function(action) {
  const costs = {
    like: { free: 5, premium: 2, vip: 0 },
    message: { free: 10, premium: 5, vip: 1 },
    superLike: { free: 20, premium: 10, vip: 5 },
    viewProfile: { free: 2, premium: 1, vip: 0 }
  };
  
  const cost = costs[action]?.[this.membership.tier] || 0;
  return this.membership.points >= cost;
};

// Method to deduct points for actions
userSchema.methods.deductPoints = function(action) {
  const costs = {
    like: { free: 5, premium: 2, vip: 0 },
    message: { free: 10, premium: 5, vip: 1 },
    superLike: { free: 20, premium: 10, vip: 5 },
    viewProfile: { free: 2, premium: 1, vip: 0 }
  };
  
  const cost = costs[action]?.[this.membership.tier] || 0;
  this.membership.points = Math.max(0, this.membership.points - cost);
  return this.save();
};

module.exports = mongoose.model('User', userSchema);