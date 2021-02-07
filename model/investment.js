const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const investmentSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  invoice: {
    type: Object,
  },
});

const Investment = mongoose.model("investment", investmentSchema);

module.exports = Investment;
