const mongoose = require("mongoose");
const { makeId } = require("../utils")

const ItemSchema = new mongoose.Schema({
  _id: { type: String, default: makeId() },
  name: { type: String, required: true },
  description: { type: String, required: true },
  slot: { type: String, required: true },
  className: { type: String, required: true },
  attackType: { type: String, required: true },
  rarity: { type: String, required: true },
  character: { type: String, required: true, ref: "Character" },
  requiredStats: Map,

  weaponAbilities: Map,
  armorProperties: Map,
  poisonProperties: Map,
  
  equipped: Boolean
});

module.exports = mongoose.model("Item", ItemSchema);
