const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const AnswerOptionSchema = require("./answer");

const TestSchema = mongoose.Schema({
  _id           :  { type: String},
  description   :  { type: String},
  createdBy     :  { type: String},
  createdDate   :  { type: String},
  totalTime     :  { type: String},
  totalQuestions:  { type: String},
  guidelines    :  { type: String},
  tags          :  { type: String},
  testPassword  :  { type: String},
  showResults   :  { type: String},
  allowResume   :  { type: String},
  availabality  :  { type: String},
  name          :  { type: String},
  email         :  { type: String},
  mobile        :  { type: String},
  location      :  { type: String},
  questions     :  [{ type: String}]
  },
{
  timestamps: true
});

module.exports = mongoose.model("Test", TestSchema);