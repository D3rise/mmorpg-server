const mongoose = require("mongoose");
const { makeId } = require("../utils")
const Notification = require("./Notification");
const Stats = require("./Stats");
const User = require("./User");

const CharacterSchema = new mongoose.Schema({
  _id: { type: String, default: makeId() },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 1 },
  nextLevelXp: { type: Number, default: 200 },
  stats: { type: String, ref: "Stats" },
  notifications: { type: String, ref: "Notification" },
  inventory: { type: [String], ref: "Item" },
  user: { type: String, ref: "User", required: true },
  className: { type: String, required: true },
  name: { type: String, unique: true, required: true },
  quests: { type: [String] },
  currentQuest: { type: String }
});

CharacterSchema.pre("save", async function(next) {
  if (this.isNew) {
    var stats;

    switch (this.className) {
      case "warrior":
        stats = {
          power: 3
        };
        break;
      case "archer": {
        stats = {
          agility: 3
        };
        break;
      }
      case "wizard": {
        stats = {
          intelligence: 3
        };
      }
    }

    stats.character = this._id;
    Stats.create(stats);

    User.findByIdAndUpdate(this.user, {
      $push: { characters: this._id }
    }).exec();
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
