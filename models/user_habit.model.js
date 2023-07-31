const mongoose = require("mongoose");
const { Schema } = mongoose;

// User schema
const userHabitSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  habit_id: { type: mongoose.Schema.Types.ObjectId, ref: "Habits" },
});

// User model
const User = mongoose.model("UserHabit", userHabitSchema);

module.exports = User;
