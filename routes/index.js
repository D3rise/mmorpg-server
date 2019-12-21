const { resolve } = require("path");
const walk = require("walk");

const routes = {};
routes.load = function(server) {
  const walker = walk.walk("./routes");

  walker.on("directory", (root, stats, next) => {
    const router = require(`${resolve(root)}/${stats.name}/index.js`);
    server.use("/api/" + stats.name + "/", router);
    logger.info(`Added API route ${"/api/" + stats.name}`);
    next();
  });
};

module.exports = routes;
