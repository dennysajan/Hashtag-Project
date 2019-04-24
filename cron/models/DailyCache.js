const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CacheSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  last_ts: {
    type: String
  },
  count: {
    type: Number
  }
});

module.exports = Tweet = mongoose.model("dailyCache", CacheSchema);
