const mongoose = require("mongoose");
const { makeId } = require("../utils");
const Notification = require("./Notification");
const Stats = require("./Stats");
const User = require("./User");
const Location = require("./Location");

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
  currentQuest: { type: String },
  checkpoint: { type: String },

  currentLocation: { type: String, ref: "Location" },
  x: { type: Number },
  y: { type: Number }
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

  if (this.isModified(x) || this.isModified(y)) {
    const currentLocation = await this.populate("currentLocation")
      .currentLocation;

    if (x === 0) {
      const newLocation = await Location.findById(
        currentLocation.rightLocation
      ).exec();

      this.currentLocation = newLocation._id;
      this.x = newLocation.xLength;
    }

    if (y === 0) {
      const newLocation = await Location.findById(
        currentLocation.bottomLocation
      ).exec();

      this.currentLocation = newLocation._id;
      this.y = newLocation.yLength;
    }

    if (x === currentLocation.xLength) {
      const newLocation = await Location.findById(
        currentLocation.leftLocation
      ).exec();

      this.currentLocation = newLocation._id;
      this.x = 0;
    }

    if (y === currentLocation.yLength) {
      const newLocation = await Location.findById(
        currentLocation.topLocation
      ).exec();

      this.currentLocation = newLocation._id;
      this.y = 0;
    }
  }

  if (this.xp >= this.nextLevelXp) {
    this.level++;
    this.nextLevelXp *= 1.1;
    Notification.create({
      character: this._id,
      label: "New level",
      text: `Now your level is ${this.level}!`
    });
  }

  next();
});

module.exports = mongoose.model("Character", CharacterSchema);
