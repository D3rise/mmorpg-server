const mongoose = require("mongoose");
const flakeid = require("flakeid");
const bcrypt = require("bcrypt");
const makeString = require("../utils/makeString");

const UserSchema = new mongoose.Schema({
  _id: String,
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verifyCode: { type: String, default: makeString(30) },
  characters: { type: [String], default: null, ref: "Character" }, // id of the character
  friends: { type: [String], default: null, ref: "User" }, // ids of friends
  currentCharacter: { type: String, default: null, ref: "Character" },
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
  if (this.isNew) {
    const Flake = new flakeid();
    this._id = Flake.gen();
  }

  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = mongoose.model("User", UserSchema);
