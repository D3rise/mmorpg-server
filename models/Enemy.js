const mongoose = require("mongoose");
const { makeId } = require("../utils");

const EnemySchema = new mongoose.Schema({
  _id: { type: String, default: makeId() },
  name: { type: String },
  level: { type: Number },
  health: { type: Number },
  location: { type: String, ref: "Location" }
});

module.exports = mongoose.model("Enemy", EnemySchema);
