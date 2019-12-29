const log4js = require("log4js");
const level = process.env.NODE_ENV === "production" ? "info" : "debug";

log4js.configure({
  appenders: { out: { type: "stdout" } },
  categories: { default: { appenders: ["out"], level } }
});

global.logger = log4js.getLogger();
