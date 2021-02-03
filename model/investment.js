const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const investmentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  invoice: {
    type: JSON,
    required: true,
  },
});

const Investment = mongoose.model("investment", investmentSchema);

module.exports = Investment;
