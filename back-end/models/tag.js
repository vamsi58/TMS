const mongoose = require("mongoose");

const TagsSchema = mongoose.Schema({
    tagName: String   
  });

  module.exports = mongoose.model("Tag", TagsSchema);