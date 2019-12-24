const io = require("socket.io")
const walk = require("walk")
const authenticate = require("../middleware/authenticateSocket")

module.exports = (server) => {
    const eventsWalker = walk.walk("./sockets/events")
    // TODO: read files from events folder and store it in map<NameOfEvent, EventHandler>, then, while user connects, create event listeners

    io.use(authenticate)
}