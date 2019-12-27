const mongoose = require("mongoose");
const { makeId } = require("../utils")
const Attributes = require("./Attributes")

const StatsSchema = new mongoose.Schema({
  _id: { type: String, default: makeId() },
  character: { type: String, ref: "Character" },
  power: { type: Number, default: 1 },
  agility: { type: Number, default: 1 },
  intelligence: { type: Number, default: 1 },
  charisma: { type: Number, default: 1 }
});

StatsSchema.pre("save", function(next) {
  if (this.isNew) {
    Attributes.create({
      stats: this._id
    })
  }

  next();
});

module.exports = mongoose.model("Stats", StatsSchema);
