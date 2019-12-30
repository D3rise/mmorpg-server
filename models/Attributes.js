const mongoose = require("mongoose");
const { makeId } = require("../utils");
const Character = require("./Character");
const formulas = require("../assets/formulas");

const AttributesSchema = new mongoose.Schema({
  _id: { type: String, default: makeId },

  character: { type: String, ref: "Character" },

  health: Number,
  damage: Number,
  mana: Number,
  weight: Number,
  evRate: Number
});

AttributesSchema.pre("save", async function(next) {
  if (this.isNew) {
    const { stats } = await Character.findById(this.character)
      .populate("stats")
      .exec();
    const { attributes } = formulas;
    this.health = attributes.health(stats.power);
    this.damage = attributes.minDamage(stats.power);
    this.evRate = attributes.evRate(stats.agility);
  }

  next();
});

module.exports = mongoose.model("Attributes", AttributesSchema);
