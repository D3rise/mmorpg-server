const mongoose = require("mongoose");
const { makeId } = require("../utils");

const NPCSchema = new mongoose.Schema({
  _id: { type: String, default: makeId },
  name: { type: String },

  location: { type: String, ref: "Location" },
  x: { type: Number },
  y: { type: Number },

  quests: { type: [String] }
});

module.exports = mongoose.model("NPC", NPCSchema);
