const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const noticeSchema = new mongoose.Schema({
  invoice: {
    type: JSON,
    required: true,
  },
});

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
