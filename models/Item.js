const mongoose = require("mongoose");
const flakeid = require("flakeid");

const ItemSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
  description: { type: String, required: true },
  slot: { type: String, required: true },
  class: { type: String, required: true },
  attackType: { type: String, required: true },
  rarity: { type: String, required: true },
  character: { type: String, required: true, ref: "User" },
  requiredStats: Map,
  statsBuff: Map,
  statsDebuff: Map,
  statsOnUsePlayer: Map,
  statsOnUseEnemy: Map,
  equipped: Boolean
});

ItemSchema.pre("save", function(next) {
  if (this.isNew) {
    const Flake = new flakeid();
    this._id = Flake.gen();
  }

  next();
});

module.exports = mongoose.model("Item", ItemSchema);
