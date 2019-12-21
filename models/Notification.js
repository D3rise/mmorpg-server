const mongoose = require("mongoose");
const flakeid = require("flakeid");
const Character = require("./Character");

const NotificationSchema = new mongoose.Schema({
  _id: String,
  text: { type: String, required: true },
  character: { type: String, ref: "Character", required: true }
});

NotificationSchema.pre("save", async function(next) {
  if (this.isNew) {
    const Flake = new flakeid();
    this._id = Flake.gen();

    await Character.findByIdAndUpdate(
      this.character,
      { $push: { notifications: this._id } },
      err => {
        if (err) next(err);
      }
    );
  }

  next();
});

module.exports = mongoose.model("Notification", NotificationSchema);
