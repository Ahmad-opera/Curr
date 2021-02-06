const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  invoice: {
    type: JSON,
    required: true,
  },
});

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
