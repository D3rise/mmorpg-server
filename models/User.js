const mongoose = require("mongoose");
const { makeId } = require("../utils");
const bcrypt = require("bcrypt");
const makeString = require("../utils/makeString");

const UserSchema = new mongoose.Schema({
  _id: { type: String, default: makeId },

  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tfaEnabled: { type: Boolean, default: false },
  tfaSecret: { type: String },

  verified: { type: Boolean, default: false },
  verifyCode: { type: String, default: makeString(30) },
  tokenVerify: { type: String, default: makeString(10) },

  characters: { type: [String], default: null, ref: "Character" }, // id of the character
  currentCharacter: { type: String, default: null, ref: "Character" },

  friends: { type: [String], default: null, ref: "User" }, // ids of friends
  locale: { type: String, default: "en" }
});

UserSchema.statics.checkIfUserWithUsernameExists = async function(username) {
  return (await this.findOne({ username }).exec()) !== null;
};

UserSchema.statics.checkIfUserWithEmailExists = async function(email) {
  return (await this.findOne({ email }).exec()) !== null;
};

UserSchema.methods.comparePassword = function(password) {
  console.log(this.password);
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre("save", async function(next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = mongoose.model("User", UserSchema);
