const Character = require("../../models/Character");

module.exports = async (socket, moveData) => {
  const dataLength = Object.entries(moveData).length;
  let update;

  switch (moveData) {
    case dataLength > 1: {
      return socket.emit("error", {
        event: "move",
        message: "You can't move on both coords on one time!"
      });
    }

    case dataLength < 1: {
      return socket.emit("error", {
        event: "move",
        message: "You need to specify 1 coord to move!"
      });
    }

    case moveData.x !== "+":
    case moveData.y !== "+":
    case moveData.x !== "-":
    case moveData.y !== "-": {
      return socket.emit("error", {
        event: "move",
        message: 'Coord value need to be "+" or "-"'
      });
    }

    case moveData.x === "+": {
      update = { x: 1 };
      break;
    }

    case moveData.x === "-": {
      update = { x: -1 };
      break;
    }

    case moveData.y === "+": {
      update = { y: 1 };
      break;
    }

    case moveData.y === "-": {
      update = { y: -1 };
      break;
    }
  }

  const user = socket.request.user;
  await Character.findByIdAndUpdate(user.currentCharacter, { $inc: update });
  socket.emit("success", { event: "move" });
};
