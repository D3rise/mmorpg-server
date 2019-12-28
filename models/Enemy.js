const mongoose = require("mongoose");
const { makeId } = require("../utils");

const EnemySchema = new mongoose.Schema({
  _id: { type: String, default: makeId() },
  name: String,
  level: Number,
  location: { type: String, ref: "Location" }
});
