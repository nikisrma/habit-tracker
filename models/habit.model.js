const mongoose = require('mongoose');
const { Schema } = mongoose;

// Habit schema
const habitSchema = new Schema({
  name: {
    type: String,
  },
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// User model
const Habits = mongoose.model('Habits', habitSchema);

module.exports = Habits;
