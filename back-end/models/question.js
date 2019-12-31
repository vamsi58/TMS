const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const AnswerOptionSchema = require("./answer");

const QuestionSchema = mongoose.Schema({
  _id:             { type: String},
  type:            { type: String},
  tags:            [{ type: String }],
  skills:          [{ type: String }],
  stmt:            { type: String, minlength: 10, maxlength: 10000, required: true},
  stmtHtml:        { type: String, minlength: 10, maxlength: 15000},
  options:         { type: [AnswerOptionSchema], default: undefined,}, 
  descAnswer:      { type: String},
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