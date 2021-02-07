const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
  },
  Firstname: {
    type: String,
    required: true,
    min: 6,
  },
  Lastname: {
    type: String,
    required: true,
    min: 6,
  },
  account_balance: {
    type: Number,
    required: true,
    default: 0.0001,
  },
  account_type: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    min: 8,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
