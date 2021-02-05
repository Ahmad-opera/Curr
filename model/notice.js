const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const noticeSchema = new mongoose.Schema({
  invoice: {
    type: Object,
    required: true,
  },
});

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
