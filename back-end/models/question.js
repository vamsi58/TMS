const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const AnswerOptionSchema = require("./answer");

const QuestionSchema = mongoose.Schema({
  _id:             { type: String},
  type:            { type: String},
  category:        { type: String},
  competency:      { type: String},
  text:            { type: String, minlength: 10, maxlength: 10000, required: true},
  textHtml:        { type: String, minlength: 10, maxlength: 15000},
  options:         { type: [AnswerOptionSchema], default: undefined,}, 
  comment:         { type: String},
  status:          { type: String},
  complexity:      { type: String}, 
  createdBy:       { type:  String},
  updatedBy:       { type:  String},
  approvedBy:      { type:  String}
  },
{
  timestamps: true
});

module.exports = mongoose.model("Question", QuestionSchema);