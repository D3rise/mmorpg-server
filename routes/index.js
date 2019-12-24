const { resolve } = require("path");
const walk = require("walk");

const routes = {};
routes.load = function(server) {
  const walker = walk.walk("./routes");

  walker.on("directory", (root, stats, next) => {
    const router = require(`${resolve(root)}/${stats.name}/index.js`);
    const errorHandlerRouter = (req, res) => {
      try {
        router(res, res)
      } catch (e) {
        logger.error(e)
        res.status(503).send({ ok: false, message: "Internal Server Error" })
      }
    }
    server.use("/api/" + stats.name + "/", errorHandlerRouter);
    logger.info(`Added API route ${"/api/" + stats.name}`);
    next();
  });
};

module.exports = routes;
