const mongoose = require("mongoose");

const uri = "mongodb+srv://strategicnetball_db_user:FaithandMiley2025@foreverusdating.womclyt.mongodb.net/?retryWrites=true&w=majority";

console.log("Testing MongoDB connection...");
console.log("URI:", uri.replace(/:[^@]+@/, ":****@"));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected successfully!");
  process.exit(0);
})
.catch((err) => {
  console.error("❌ Connection failed:", err.message);
  process.exit(1);
});
