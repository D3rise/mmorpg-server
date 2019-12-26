const SocketIO = require("socket.io")
const walk = require("walk")
const authenticate = require("../middleware/authenticateSocket")
const { resolve } = require("path")

var sockets = {}

sockets.load = (server) => {
    const io = SocketIO(server)
    sockets.io = io
    io.use(authenticate)

    io.on("connection", socket => {
        const walker = walk.walk("./sockets/events");

        walker.on("file", (root, stats, next) => {
          if (!stats.name.endsWith(".js")) return;
          const Event = require(`${resolve(root)}/${stats.name}`);
          let name = stats.name.substring(0, stats.name.length - 3);
          socket.on(name, (...args) => Event.run(this.io, socket, ...args));
          next();
        });

        socket.join(socket.request.user._id)
    })
}

module.exports = sockets