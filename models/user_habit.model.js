const mongoose = require("mongoose");
const { Schema } = mongoose;
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

const formattedDate = getCurrentDate();
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
