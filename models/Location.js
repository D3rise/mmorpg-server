const mongoose = require("mongoose")
const { makeId } = require("../utils")

const LocationSchema = new mongoose.Schema({
    _id: { type: String, default: makeId() },
    name: { type: String },
    players: { type: [String], ref: 'Character' },
    enemies: { type: [String], ref: 'Enemy' }
})

module.exports = LocationSchema