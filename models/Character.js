const mongoose = require("mongoose");
const flakeid = require("flakeid");
const Notification = require("./Notification");

const CharacterSchema = new mongoose.Schema({
  _id: String,
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 1 },
  nextLevelXp: { type: Number, default: 200 },
  abilities: { type: String, ref: "Ability" },
  stats: { type: String, ref: "Stats" },
  notifications: { type: String, ref: "Notification" },
  inventory: { type: [String], ref: "Item" },
  user: { type: String, ref: "User", required: true },
  class: { type: String, required: true }
});

CharacterSchema.pre("save", function(next) {
  if (this.isNew) {
    const Flake = new flakeid();
    this._id = Flake.gen();
  }

  if (this.xp >= this.nextLevelXp) {
    this.level++;
    this.nextLevelXp *= 1.1;
    Notification.create({
      character: this._id,
      text: ``
    });
  }

  next();
});

module.exports = mongoose.model("Character", CharacterSchema);
