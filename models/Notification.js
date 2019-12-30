const mongoose = require("mongoose");
const { makeId } = require("../utils");
const Character = require("./Character");
const sockets = require("../sockets");

const NotificationSchema = new mongoose.Schema({
  _id: { type: String, default: makeId },

  label: { type: String, required: true },
  text: { type: String, required: true },

  character: { type: String, ref: "Character", required: true }
});

NotificationSchema.pre("save", async function(next) {
  if (this.isNew) {
    await Character.findByIdAndUpdate(
      this.character,
      { $push: { notifications: this._id } },
      err => {
        if (err) next(err);
      }
    );

    const user = await Character.findById(this.character)
      .populate("user")
      .exec().user;
    sockets.io
      .to(user._id)
      .emit("notification", { label: this.label, text: this.text });
  }

  next();
});

module.exports = mongoose.model("Notification", NotificationSchema);
