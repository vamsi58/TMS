const mongoose = require("mongoose");

const CountersSchema = mongoose.Schema({
    name: String,
    next: Number     
  });

  module.exports = mongoose.model("Counters", CountersSchema);