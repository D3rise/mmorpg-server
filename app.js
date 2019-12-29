const createError = require("http-errors");
const express = require("express");
const log4js = require("log4js");
const mongoose = require("mongoose");
const passport = require("passport");

const config = require("./config/database");

mongoose.connect(
  config.database,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  err => {
    if (err) {
      return logger.error("Can't connect to DB: \n" + err);
    }
    logger.info("Connected to DB");
  }
);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  log4js.connectLogger(logger, {
    level: app.get("env") === "development" ? "debug" : "info"
  })
);

app.get("/", function(req, res) {
  res.send("Page under construction.");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
