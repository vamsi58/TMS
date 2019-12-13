const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  fullname: {type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: {type: Date, required: true },
  gender: {type: String, required: true },
  role: {type: [String], required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
