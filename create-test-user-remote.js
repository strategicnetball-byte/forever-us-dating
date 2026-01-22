const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // First, delete existing test user if any
    await User.deleteOne({ email: "test@example.com" });

    // Create user with plain password - the pre-save hook will hash it
    const testUser = new User({
      email: "test@example.com",
      password: "test123",
      profile: {
        name: "Test User",
        age: 25,
        gender: "male",
        lookingFor: ["female"],
        bio: "Test user for development",
        location: "Test City",
        interests: ["travel", "music", "sports"]
      },
      membership: {
        tier: "free",
        points: 100,
        earnedPoints: 0
      },
      preferences: {
        ageRange: { min: 18, max: 50 },
        maxDistance: 50
      }
    });

    await testUser.save();
    console.log(" Test user created successfully");
    console.log("Email: test@example.com");
    console.log("Password: test123");
    
    // Verify password works
    const savedUser = await User.findOne({ email: "test@example.com" });
    const passwordMatch = await savedUser.comparePassword("test123");
    console.log("Password verification:", passwordMatch ? "✅ PASS" : "❌ FAIL");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createTestUser();
