const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Questionnaire questions
const QUESTIONNAIRE = [
  // Core Values & Life Philosophy (Questions 1-3)
  {
    id: 'coreValues',
    question: 'What are your core life values?',
    type: 'multi',
    maxSelect: 3,
    options: ['Family & Tradition', 'Career & Ambition', 'Adventure & Travel', 'Spirituality & Faith', 'Health & Wellness', 'Creativity & Arts', 'Social Impact', 'Financial Security']
  },
  {
    id: 'lifePhilosophy',
    question: 'How do you approach life?',
    type: 'multi',
    maxSelect: 3,
    options: ['Live for today', 'Plan for the future', 'Balance both equally', 'Go with the flow', 'Structured & organized']
  },
  {
    id: 'personalGrowth',
    question: 'What drives your personal growth?',
    type: 'multi',
    maxSelect: 3,
    options: ['Learning & education', 'Travel & experiences', 'Relationships & community', 'Career success', 'Health & fitness', 'Spiritual development', 'Creative pursuits', 'Financial independence']
  },

  // Lifestyle & Social (Questions 4-7)
  {
    id: 'lifestyle',
    question: 'How would you describe your lifestyle?',
    type: 'multi',
    maxSelect: 3,
    options: ['Social butterfly', 'Homebody', 'Adventurous', 'Balanced', 'Workaholic', 'Laid-back', 'Active & outdoorsy', 'Cultural & intellectual']
  },
  {
    id: 'weekendIdeal',
    question: 'Your ideal weekend is:',
    type: 'multi',
    maxSelect: 3,
    options: ['Quiet time at home', 'Out with friends', 'Exploring new places', 'Relaxing & recharging', 'Active & outdoors', 'Cultural events', 'Family time', 'Spontaneous adventure']
  },
  {
    id: 'socialLife',
    question: 'How important is your social life?',
    type: 'single',
    options: ['Very important - I\'m always out', 'Important - regular social time', 'Moderate - selective socializing', 'Low - prefer small circles', 'Very low - mostly alone']
  },
  {
    id: 'introvertExtrovert',
    question: 'Are you more introverted or extroverted?',
    type: 'single',
    options: ['Very introverted', 'Somewhat introverted', 'Ambivert (balanced)', 'Somewhat extroverted', 'Very extroverted']
  },

  // Relationship Goals & Expectations (Questions 8-11)
  {
    id: 'relationshipGoal',
    question: 'What are you looking for?',
    type: 'single',
    options: ['Casual dating', 'Serious relationship', 'Marriage', 'Life partner', 'Not sure yet', 'Just friends', 'Open to anything']
  },
  {
    id: 'timelineCommitment',
    question: 'What\'s your timeline for commitment?',
    type: 'single',
    options: ['ASAP', 'Within 1-2 years', 'Within 3-5 years', 'No rush', 'Undecided', 'Not looking for commitment']
  },
  {
    id: 'childrenPlans',
    question: 'Do you want children?',
    type: 'single',
    options: ['Yes, definitely', 'Maybe someday', 'Not sure', 'No, not for me', 'Already have kids', 'Open to discussion']
  },
  {
    id: 'relationshipStyle',
    question: 'Your relationship style is:',
    type: 'single',
    options: ['Independent & separate lives', 'Interdependent & balanced', 'Very connected & together', 'Flexible & adaptable', 'Traditional roles']
  },

  // Communication & Conflict (Questions 12-14)
  {
    id: 'communicationStyle',
    question: 'How do you prefer to communicate?',
    type: 'multi',
    maxSelect: 3,
    options: ['Deep conversations', 'Fun & playful', 'Direct & honest', 'Thoughtful & reflective', 'Spontaneous', 'Planned & organized', 'Emotional & expressive', 'Logical & analytical']
  },
  {
    id: 'conflictResolution',
    question: 'How do you handle conflict?',
    type: 'single',
    options: ['Talk it out immediately', 'Need space first', 'Compromise & negotiate', 'Avoid confrontation', 'Direct & assertive', 'Seek professional help']
  },
  {
    id: 'emotionalExpression',
    question: 'How comfortable are you with emotional expression?',
    type: 'single',
    options: ['Very comfortable - I share openly', 'Comfortable - I express feelings', 'Somewhat reserved', 'Prefer to keep emotions private', 'Struggle with emotions']
  },

  // Finances & Practical (Questions 15-17)
  {
    id: 'financialValues',
    question: 'How do you view finances?',
    type: 'single',
    options: ['Save & invest', 'Spend & enjoy', 'Balanced approach', 'Money isn\'t important', 'Build wealth', 'Live simply']
  },
  {
    id: 'careerImportance',
    question: 'How important is career to you?',
    type: 'single',
    options: ['Very important - it\'s my priority', 'Important - significant part of life', 'Moderate - balance with personal life', 'Low - just a job', 'Not important - prefer other pursuits']
  },
  {
    id: 'livingArrangement',
    question: 'What\'s your ideal living situation?',
    type: 'single',
    options: ['City center', 'Suburbs', 'Small town', 'Rural/countryside', 'Doesn\'t matter', 'Willing to relocate']
  },

  // Health & Wellness (Questions 18-19)
  {
    id: 'healthPriority',
    question: 'How important is health & fitness?',
    type: 'single',
    options: ['Very important - I\'m very active', 'Important - regular exercise', 'Moderate - some activity', 'Low - not a priority', 'Prefer other activities']
  },

  // Interests & Hobbies (Questions 20-21)
  {
    id: 'interests',
    question: 'What are your main interests?',
    type: 'multi',
    maxSelect: 5,
    options: ['Sports & fitness', 'Arts & culture', 'Music & concerts', 'Travel & exploration', 'Cooking & food', 'Gaming & tech', 'Reading & writing', 'Outdoor activities', 'Movies & TV', 'Volunteering', 'Fashion & style', 'Photography']
  },
  {
    id: 'entertainmentPreference',
    question: 'How do you prefer to spend free time?',
    type: 'multi',
    maxSelect: 3,
    options: ['Watching movies/TV', 'Reading', 'Gaming', 'Sports', 'Socializing', 'Traveling', 'Hobbies & crafts', 'Relaxing at home', 'Exploring new places', 'Volunteering']
  },

  // Personality Traits (Questions 22-23)
  {
    id: 'personalityTraits',
    question: 'Which traits describe you best?',
    type: 'multi',
    maxSelect: 4,
    options: ['Optimistic', 'Realistic', 'Ambitious', 'Laid-back', 'Spontaneous', 'Organized', 'Empathetic', 'Independent', 'Loyal', 'Adventurous', 'Cautious', 'Humorous']
  },
  {
    id: 'dealBreakers',
    question: 'What are your red flags or deal-breakers?',
    type: 'text'
  },

  // Expectations & Compatibility (Questions 24-25)
  {
    id: 'partnerExpectations',
    question: 'What do you value most in a partner?',
    type: 'multi',
    maxSelect: 4,
    options: ['Honesty & trust', 'Sense of humor', 'Intelligence', 'Kindness & empathy', 'Ambition', 'Physical attraction', 'Shared values', 'Emotional support', 'Independence', 'Loyalty', 'Adventurousness', 'Stability']
  },
  {
    id: 'relationshipExpectations',
    question: 'In a relationship, I expect:',
    type: 'multi',
    maxSelect: 3,
    options: ['Regular communication', 'Quality time together', 'Personal space & independence', 'Shared responsibilities', 'Emotional intimacy', 'Physical intimacy', 'Shared hobbies', 'Financial transparency', 'Honesty & openness', 'Mutual respect']
  }
];

// Get questionnaire
router.get('/questionnaire', (req, res) => {
  res.json(QUESTIONNAIRE);
});

// Update VIP score filter preferences
router.put('/score-filter', auth, async (req, res) => {
  console.log('🔧 PUT /score-filter called');
  try {
    const { minScore, maxScore } = req.body;
    console.log('📊 Received scores:', { minScore, maxScore });
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Only VIP users can customize score filters
    if (user.membership.tier !== 'vip') {
      return res.status(403).json({ message: 'Only VIP members can customize compatibility score filters' });
    }
    
    // Validate ranges
    if (typeof minScore !== 'number' || typeof maxScore !== 'number') {
      return res.status(400).json({ message: 'Invalid score values' });
    }
    
    if (minScore < 0 || maxScore > 100 || minScore > maxScore) {
      return res.status(400).json({ message: 'Score must be between 0-100 and min <= max' });
    }
    
    user.compatibility.scoreFilter = {
      minScore,
      maxScore
    };
    
    await user.save();
    
    console.log(`✅ Updated score filter for VIP user ${req.userId}: ${minScore}-${maxScore}%`);
    res.json({ 
      message: 'Score filter updated',
      scoreFilter: user.compatibility.scoreFilter
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current score filter preferences
router.get('/score-filter', auth, async (req, res) => {
  console.log('🔍 GET /score-filter called');
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const scoreFilter = user.compatibility.scoreFilter || { minScore: 0, maxScore: 100 };
    const tier = user.membership.tier;
    
    res.json({ 
      scoreFilter,
      tier,
      canCustomize: tier === 'vip'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit questionnaire responses
router.post('/submit', auth, async (req, res) => {
  try {
    console.log('📝 Submitting questionnaire for user:', req.userId);
    console.log('📝 Responses:', req.body.responses);
    
    const { responses } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('❌ User not found:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.email);

    // Store questionnaire responses
    user.compatibility.questionnaire = {
      values: responses.coreValues || [],
      lifestyle: responses.lifestyle || [],
      relationshipGoal: responses.relationshipGoal || '',
      dealBreakers: responses.dealBreakers || [],
      interests: responses.interests || [],
      communication: responses.communicationStyle || '',
      finances: responses.financialValues || '',
      health: responses.healthPriority || '',
      personality: responses.personalityTraits || [],
      expectations: responses.relationshipExpectations || [],
      completedAt: new Date()
    };

    console.log('💾 Saving questionnaire...');
    await user.save();
    console.log('✅ Questionnaire saved');

    // Calculate compatibility with all other users (async, don't wait)
    calculateCompatibilityScores(user._id).catch(err => console.error('Compatibility calculation error:', err));

    res.json({ message: 'Questionnaire submitted successfully', user });
  } catch (error) {
    console.error('❌ Submit questionnaire error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get high compatibility matches (70%+)
router.get('/matches', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    console.log('\n🔍 COMPATIBILITY MATCHES REQUEST');
    console.log('   User ID:', req.userId);
    console.log('   User email:', user?.email);
    console.log('   User tier:', user?.membership?.tier);
    
    if (!user) {
      console.log('   ❌ User not found!');
      return res.status(404).json({ message: 'User not found', userId: req.userId });
    }
    
    if (!user.membership) {
      console.log('   ❌ User has no membership!');
      return res.status(400).json({ message: 'User membership not initialized' });
    }
    
    console.log('   Questionnaire completed:', !!user.compatibility.questionnaire.completedAt);
    
    if (!user.compatibility.questionnaire.completedAt) {
      console.log('   ❌ Questionnaire not completed - returning empty');
      return res.json({ 
        matches: [],
        questionnaireCompleted: false
      });
    }

    // Free tier users don't get compatibility matches
    if (user.membership.tier === 'free') {
      console.log('   ❌ Free tier user - no matches available');
      return res.json({ 
        matches: [],
        questionnaireCompleted: true,
        message: 'Upgrade to Premium or VIP to see compatibility matches'
      });
    }

    // Determine score range based on tier and user preferences
    let minScore = 0;
    let maxScore = 100;
    
    if (user.membership.tier === 'premium') {
      minScore = 0;
      maxScore = 45;
      console.log('   Premium tier: showing 0-45% matches');
    } else if (user.membership.tier === 'vip') {
      // VIP can customize their range
      minScore = user.compatibility.scoreFilter?.minScore || 0;
      maxScore = user.compatibility.scoreFilter?.maxScore || 100;
      console.log(`   VIP tier: showing ${minScore}-${maxScore}% matches (custom range)`);
    }

    // Get scores within the allowed range
    const matches = user.compatibility.scores
      .filter(score => score.score >= minScore && score.score <= maxScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Limit to top 50

    console.log('   Filtered matches:', matches.length);
    if (matches.length > 0) {
      console.log('   Top 3 scores:', matches.slice(0, 3).map(m => ({ score: m.score })));
    }

    // Populate user details
    const populatedMatches = await User.populate(matches, {
      path: 'userId',
      select: 'profile.name profile.age profile.photos profile.bio profile.interests membership.tier'
    });

    console.log('   ✅ Sending response with', populatedMatches.length, 'matches\n');

    res.json({ 
      matches: populatedMatches,
      questionnaireCompleted: true,
      scoreRange: { min: minScore, max: maxScore }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Calculate compatibility between two users
async function calculateCompatibilityScores(userId) {
  try {
    const user = await User.findById(userId);
    if (!user.compatibility.questionnaire.completedAt) return;

    const allUsers = await User.find({ _id: { $ne: userId } });

    for (const otherUser of allUsers) {
      if (!otherUser.compatibility.questionnaire.completedAt) continue;

      const score = calculateCompatibility(user, otherUser);
      
      // Update user's scores
      const existingScore = user.compatibility.scores.findIndex(s => s.userId.toString() === otherUser._id.toString());
      if (existingScore >= 0) {
        user.compatibility.scores[existingScore].score = score;
        user.compatibility.scores[existingScore].calculatedAt = new Date();
      } else {
        user.compatibility.scores.push({
          userId: otherUser._id,
          score,
          calculatedAt: new Date()
        });
      }

      // Update other user's scores
      const otherExistingScore = otherUser.compatibility.scores.findIndex(s => s.userId.toString() === userId.toString());
      if (otherExistingScore >= 0) {
        otherUser.compatibility.scores[otherExistingScore].score = score;
        otherUser.compatibility.scores[otherExistingScore].calculatedAt = new Date();
      } else {
        otherUser.compatibility.scores.push({
          userId,
          score,
          calculatedAt: new Date()
        });
      }

      await otherUser.save();
    }

    await user.save();
    console.log(`✅ Calculated compatibility scores for user ${userId}`);
  } catch (error) {
    console.error('Error calculating compatibility scores:', error);
  }
}

// Calculate compatibility score between two users (0-100)
function calculateCompatibility(user1, user2) {
  let score = 0;
  let factors = 0;

  const q1 = user1.compatibility.questionnaire;
  const q2 = user2.compatibility.questionnaire;

  // Helper to compare values (handles both strings and arrays)
  const compareValues = (val1, val2) => {
    if (Array.isArray(val1) && Array.isArray(val2)) {
      const shared = val1.filter(v => val2.includes(v)).length;
      return shared / Math.max(val1.length, val2.length, 1);
    }
    return val1 === val2 ? 1 : 0;
  };

  // Values match (20 points)
  const valuesMatch = compareValues(q1.values, q2.values);
  score += valuesMatch * 20;
  factors += 20;

  // Lifestyle match (20 points)
  const lifestyleMatch = compareValues(q1.lifestyle, q2.lifestyle);
  score += lifestyleMatch * 20;
  factors += 20;

  // Relationship goal match (25 points) - most important
  if (q1.relationshipGoal === q2.relationshipGoal) {
    score += 25;
  } else {
    score += 5;
  }
  factors += 25;

  // Deal-breakers check (15 points)
  // For text-based dealbreakers, we do a simple check: if both have dealbreakers, assume potential conflict
  // This is a simplified approach - in production, you might use NLP or keyword matching
  const hasConflictingDealBreaker = q1.dealBreakers && q2.dealBreakers && 
    q1.dealBreakers.length > 0 && q2.dealBreakers.length > 0;
  if (!hasConflictingDealBreaker) {
    score += 15;
  }
  factors += 15;

  // Shared interests (20 points)
  const interestsMatch = compareValues(q1.interests, q2.interests);
  score += interestsMatch * 20;
  factors += 20;

  return Math.round((score / factors) * 100);
}

module.exports = router;
