const { resolve } = require("path");
const walk = require("walk");

module.exports = function(server) {
  const walker = walk.walk("./routes");

  walker.on("directory", (root, stats, next) => {
    // eslint-disable-next-line security/detect-non-literal-require
    const router = require(`${resolve(root)}/${stats.name}/index.js`);
    const errorHandlerRouter = async (req, res) => {
      try {
        await router(req, res);
      } catch (e) {
        logger.error(e);
        res.status(503).send({ ok: false, message: "Internal Server Error" });
      }
    };
    server.use("/api/" + stats.name + "/", router);
    logger.info(`Added API route ${"/api/" + stats.name}`);
    next();
  });
};
