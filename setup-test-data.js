const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function setupTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Upgrade test user to VIP
    const testUser = await User.findOne({ email: "test@example.com" });
    if (testUser) {
      testUser.membership.tier = "vip";
      testUser.membership.points = 1000;
      await testUser.save();
      console.log(" Test user upgraded to VIP");
    }

    // Create 10 dummy users
    const dummyUsers = [];
    const names = ["Emma", "Sophia", "Olivia", "Ava", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn"];
    const interests = [
      ["travel", "music", "sports"],
      ["reading", "cooking", "art"],
      ["hiking", "photography", "yoga"],
      ["movies", "gaming", "tech"],
      ["fitness", "dancing", "fashion"],
      ["nature", "volunteering", "music"],
      ["books", "coffee", "travel"],
      ["sports", "adventure", "outdoors"],
      ["art", "museums", "culture"],
      ["fitness", "wellness", "meditation"]
    ];

    for (let i = 0; i < 10; i++) {
      const dummyUser = new User({
        email: `dummy${i + 1}@example.com`,
        password: "password123",
        profile: {
          name: names[i],
          age: 20 + Math.floor(Math.random() * 15),
          gender: "female",
          lookingFor: ["male"],
          bio: `Hi! I'm ${names[i]}, looking to meet interesting people.`,
          location: "Test City",
          interests: interests[i],
          height: "5'6\"",
          eyeColor: "Brown",
          bodyType: "Athletic"
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
      
      await dummyUser.save();
      dummyUsers.push(dummyUser);
    }

    console.log(`✅ Created ${dummyUsers.length} dummy users`);
    console.log("\nDummy users created:");
    dummyUsers.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.profile.name} (${u.email})`);
    });

    process.exit(0);
  } catch (error) {
    console.error(" Error:", error.message);
    process.exit(1);
  }
}

setupTestData();
