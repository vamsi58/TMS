const mongoose = require("mongoose");

const SkillsSchema = mongoose.Schema({
    skillName: String   
  });

  module.exports = mongoose.model("Skill", SkillsSchema);