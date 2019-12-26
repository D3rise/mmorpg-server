const { body } = require("express-validator");
const Character = require("../models/Character");
const User = require("../models/User");

exports.createCharacter = async (req, res) => {
  const { user } = req;
  const { name, className } = req.body;

  let character = await Character.findOne({ name }).exec();

  if (character)
    return res.status(400).send({
      ok: false,
      message: req.__(`Character with this name already exists`)
    });

  character = await Character.create({ name, className, user });
  return res.send({
    ok: true,
    message: req.__f(`Character with name {name} successfully created`, {
      name: character.name
    })
  });
};

exports.changeCharacter = async (req, res) => {
  const { user } = req;
  const { newCharacter } = req.body;

  if (!user.characters.includes(newCharacter))
    return res.send({
      ok: false,
      message: req.__("You do not have access to this character")
    });
  await User.findByIdAndUpdate(user._id, {
    currentCharacter: newCharacter
  }).exec();

  return res.send({
    ok: true,
    message: req.__f(
      "Successfully changed current character to {newCharacter}",
      { newCharacter }
    )
  });
};

exports.validate = route => {
  switch (route) {
    case "createCharacter": {
      return [
        body("name", "Invalid name of character")
          .exists()
          .withMessage("username parameter is required")
          .isString()
          .isLength({ min: 3, max: 20 })
          .withMessage("Length of name has to be in range of 3 and 20"),
        body("className", "Invalid className")
          .exists()
          .withMessage("className parameter is required")
          .isString()
          .matches(/warrior|archer|wizard|slayer/g)
          .withMessage(
            "className must be one of: warrior, archer, wizard, slayer"
          )
      ];
    }

    case "changeCharacter": {
      return [
        body("newCharacter", "Invalid newCharacter")
          .isString()
          .exists()
          .withMessage("newCharacter parameter is required")
      ];
    }
  }
};
