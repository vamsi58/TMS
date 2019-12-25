const mongoose = require("mongoose");

const AnswerOptionSchema = mongoose.Schema({
    option:          { type: Number},
    answer:          { type: String, minlength: 1, maxlength: 500,},
    isCorrect:       { type: Boolean, default: false}
  }, {
    _id: false
  });

  module.exports = AnswerOptionSchema;