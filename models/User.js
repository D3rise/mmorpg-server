const mongoose = require("mongoose");
const flakeid = require("flakeid");
const i18n = require("i18n");
const { makeString } = require("../utils/makeString");

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
  locale: String
});

UserSchema.pre("save", function(next) {
  if (this.isNew) {
    const Flake = new flakeid();
    this._id = Flake.gen();
  }

  next();
});

UserSchema.methods.__ = function(phrase) {
  const obj = {};
  i18n.configure({
    locales: ["en", "ru"],
    defaultLocale: this.locale,
    directory: __dirname + "/../locales",
    register: obj
  });

  return obj.__(phrase);
};

module.exports = mongoose.model("User", UserSchema);
