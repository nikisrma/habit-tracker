const mongoose = require('mongoose');
const { Schema } = mongoose;

// User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token:{
    type:String,
  },
  habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habits' }]
});

// User model
const User = mongoose.model('User', userSchema);

module.exports = User;
