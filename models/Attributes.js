const mongoose = require("mongoose");
const flakeid = require("flakeid");
const Stats = require("./Stats");
const formulas = require("../formulas");

const AttributesSchema = new mongoose.Schema({
  _id: String,
  stats: { type: String, ref: "Stats" },
  health: Number,
  damage: Number,
  mana: Number,
  weight: Number,
  evRate: Number
});

AttributesSchema.pre("save", async function(next) {
  if (this.isNew) {
    const Flake = new flakeid();
    this._id = Flake.gen();

    const stats = await Stats.findById(this.stats).exec();
    const { attributes } = formulas;
    this.health = attributes.health(stats.power);
    this.damage = attributes.minDamage(stats.power);
    this.evRate = attributes.evRate(stats.agility);
  }

  next();
});

module.exports = mongoose.model("Attributes", AttributesSchema);
