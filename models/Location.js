const mongoose = require("mongoose");
const { makeId } = require("../utils");

const LocationSchema = new mongoose.Schema({
  _id: { type: String, default: makeId() },
  name: { type: String },
  players: { type: [String], ref: "Character" },
  enemies: { type: [String], ref: "Enemy" },
  xLength: { type: Number },
  yLength: { type: Number },
  topLocation: { type: String, ref: "Location" },
  bottomLocation: { type: String, ref: "Location" },
  leftLocation: { type: String, ref: "Location" },
  rightLocation: { type: String, ref: "Location" }
});

module.exports = LocationSchema;
