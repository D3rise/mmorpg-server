const mongoose = require("mongoose");
const flakeid = require("flakeid");

const StatsSchema = new mongoose.Schema({
  _id: String,
  character: { type: String, ref: "Character" },
  power: { type: Number, default: 1 },
  agility: { type: Number, default: 1 },
  intelligence: { type: Number, default: 1 },
  charisma: { type: Number, default: 1 }
});

StatsSchema.pre("save", function(next) {
  if (this.isNew) {
    const Flake = new flakeid();
    this._id = Flake.gen();
  }

  next();
});

module.exports = mongoose.model("Stats", StatsSchema);