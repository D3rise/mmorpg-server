const User = require("../models/User");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = bcrypt.hash(password, 10);

  try {
    await User.create({
      email,
      username,
      password: passwordHash
    });

    res.send({ ok: true, message: "User created successfully" });
  } catch (e) {
    if (e.keyPattern && e.keyPattern.email === 1)
      return res.status(400).send({
        ok: false,
        message: "User with this email already exists"
      });
    logger.error(e);
    return res
      .status(503)
      .send({ ok: false, message: `Internal server error` });
  }
};

exports.modifyUser = async (req, res) => {
  const { modifyData } = req.body;
  const { user } = req;
  const modify = JSON.parse(modifyData);

  try {
    await User.findByIdAndUpdate(user.id, modify);
    return res.send({ ok: true, message: "User modified successfully" });
  } catch (e) {
    return res.status(503).send({ ok: false, message: e.message });
  }
};

exports.verifyUser = async (req, res) => {
  const { verifyCode } = req.body;
  const { id } = req.user;

  try {
    const user = await User.findById(id).exec();

    if (user.verified)
      return res
        .status(400)
        .send({ ok: false, message: "You already verified your account" });
    if (verifyCode !== user.verifyCode)
      return res
        .status(400)
        .send({ ok: false, message: "Invalid verify code" });

    await User.findByIdAndUpdate(user.id, { verified: true }).exec();
    return res.send({ ok: true, message: "User verified successfully" });
  } catch (e) {
    return res.status(503).send({ ok: false, message: e.message });
  }
};

exports.validate = route => {
  switch (route) {
    case "createUser": {
      return [
        body("username", "Invalid username")
          .exists()
          .withMessage("'username' argument is required")
          .isString(),
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
          .isJSON()
      ];
    }

    case "verifyUser": {
      return [
        body("verifyCode", "Invalid verifyCode")
          .exists()
          .withMessage("verifyCode parameter is required")
          .isString()
      ];
    }
  }
};
