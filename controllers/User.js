const User = require("../models/User");
const { body, query } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const makeString = require("../utils/makeString");

// TODO: Send message to user's email with verification string like http://mmmorpg.pw/api/users/verify?verifyCode=PoRSWnQrtGB7gN0zR59GeierZvpvV9

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (await User.checkIfUserWithEmailExists(email))
      return res
        .status(400)
        .send({ ok: false, message: "User with this email already exists!" });

    if (await User.checkIfUserWithUsernameExists(username))
      return res.status(400).send({
        ok: false,
        message: "User with this username already exists!"
      });

    await User.create({
      email,
      username,
      password
    });

    res.send({ ok: true, message: "User created successfully" });
  } catch (e) {
    logger.error(e);
    return res
      .status(503)
      .send({ ok: false, message: `Internal server error` });
  }
};

exports.login = async (req, res) => {
  const { email, username, password } = req.query;
  let user;

  if (typeof email !== "undefined" || typeof username !== "undefined") {
    user = email
      ? await User.findOne({ email }).exec()
      : await User.findOne({ username }).exec();
  } else {
    return res.status(400).send({ ok: false, message: "Not enough arguments" });
  }

  if (!user)
    return res.status(400).send({
      ok: false,
      message: "User with this email/username does not exists"
    });

  const result = user.comparePassword(password);
  if (result) {
    const token = jwt.sign(
      { id: user._id, verify: user.tokenVerify },
      config.secret
    );
    return res
      .status(200)
      .send({ ok: true, message: `Logged in as ${user.username}`, token });
  } else
    return res.status(401).send({ ok: false, message: "Invalid password" });
};

exports.modifyUser = async (req, res) => {
  const { modifyData, password } = req.body;
  const { user } = req;
  const modify = JSON.parse(modifyData);

  if (!user.comparePassword(password))
    return res
      .status(403)
      .send({ ok: false, message: req.__("Invalid password") });

  if (modifyData.includes("email")) {
    if (User.checkIfUserWithEmailExists(modify.email))
      return res.status(400).send({ ok: false, message: req.__("") });

    // TODO: Sent message to user's email with verification string
    const verificationCode = makeString(30);
    User.findByIdAndUpdate(user._id, {
      verified: false,
      verifyCode: verificationCode
    });
  }

  if (modifyData.includes("username"))
    await User.findByIdAndUpdate(user.id, modify).exec();
  return res.send({
    ok: true,
    message: res.__("User modified successfully")
  });
};

exports.verifyUser = async (req, res) => {
  const { verifyCode } = req.query;
  const { user } = req;

  if (user.verified)
    return res.status(400).send({
      ok: false,
      message: req.__("You already verified your account")
    });
  if (verifyCode !== user.verifyCode)
    return res.status(400).send({
      ok: false,
      message: req.__("You already verified your account")
    });

  await User.findByIdAndUpdate(user.id, { verified: true }).exec();
  return res.send({
    ok: true,
    message: req.__("User verified successfully")
  });
};

exports.validate = route => {
  switch (route) {
    case "createUser": {
      return [
        body("username", "Invalid username")
          .exists()
          .withMessage("'username' argument is required")
          .isString()
          .isLength({ min: 3, max: 20 })
          .withMessage(
            "Length of username parameter has to be in range of 3 and 20 symbols"
          ),
        body("email", "Invalid email")
          .exists()
          .withMessage("'email' argument is required")
          .isEmail(),
        body("password", "Invalid password")
          .exists()
          .withMessage("'password' argument is required")
          .isLength({ min: 9 })
          .withMessage("the password must be longer than 9 characters")
      ];
    }

    case "modifyUser": {
      return [
        body("modifyData", "Invalid modifyData")
          .exists()
          .withMessage("modifyData parameter is not found")
          .isJSON(),
        body("password", "Invalid password")
          .exists()
          .withMessage("password parameter is required")
          .isString()
          .isLength({ min: 9 })
          .withMessage("Min length of password is 9")
      ];
    }

    case "verifyUser": {
      return [
        query("verifyCode", "Invalid verifyCode")
          .exists()
          .withMessage("verifyCode parameter is required")
          .isString()
      ];
    }

    case "changePassword": {
      return [
        body("oldPassword", "Invalid oldPassword")
          .exists()
          .withMessage("oldPassword parameter is required")
          .isString(),
        body("newPassword", "Invalid newPassword")
          .exists()
          .withMessage("newPassword parameter is required")
      ];
    }

    case "login": {
      return [
        query("password", "Invalid password parameter")
          .exists()
          .withMessage("password parameter is required")
          .isString()
          .isLength({ min: 9 })
          .withMessage("Min length of password is 9")
      ];
    }
  }
};
