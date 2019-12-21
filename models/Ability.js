const mongoose = require("mongoose");
const flakeid = require("flakeid");

const AbilitySchema = new mongoose.Schema({
  _id: String,
  name: String,
  missRate: Number,
  damageMin: Number,
  damageMax: Number,
  class: String,
  character: { type: String, required: true, ref: "User" }
});

AbilitySchema.pre("save", function(next) {
  if (this.isNew) {
    const Flake = new flakeid();
    this._id = Flake.gen();
  }

  next();
});

module.exports = mongoose.model("Ability", AbilitySchema);
