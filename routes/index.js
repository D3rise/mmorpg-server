const { resolve } = require("path");
const walk = require("walk");

const router = require("express").Router();
const walker = walk.walk("./routes");

walker.on("directory", (root, stats, next) => {
  const router = require(`${resolve(root)}/${stats.name}/index.js`);
  const errorHandlerRouter = (req, res) => {
    try {
      router(res, res);
    } catch (e) {
      logger.error(e);
      res.status(503).send({ ok: false, message: "Internal Server Error" });
    }
  };
  router.use("/api/" + stats.name + "/", errorHandlerRouter);
  logger.info(`Added API route ${"/api/" + stats.name}`);
  next();
});

module.exports = router;
