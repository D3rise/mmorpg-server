const Character = require("../models/Character");
const { body } = require("express-validator");

exports.getQuests = async (req, res) => {
  const character = req.user.currentCharacter;
  const quests = character.quests;
  return res.send({ ok: true, quests });
};

exports.setQuest = async (req, res) => {
  const character = req.user.currentCharacter;
  const quests = character.quests;
  const { quest } = req.body;

  if (!quests.include(quest))
    return res.send({
      ok: false,
      message: req.__("You do not have opened this quest")
    });
  await Character.findByIdAndUpdate(character._id, {
    currentQuest: quest
  }).exec();

  return res.send({
    ok: true,
    message: req.__("Current quest successfully changed")
  });
};

exports.declineQuest = async (req, res) => {
  const character = req.user.currentCharacter;
  const quests = character.quests;
  const { quest } = req.body;

  if (!quests.include(quest))
    return res.send({
      ok: false,
      message: req.__("You do not have opened this quest")
    });

  await Character.findByIdAndUpdate(character._id, {
    $pull: { quests: quest }
  }).exec();
  return res.send({
    ok: true,
    message: req.__f("Quest {quest} successfully declined", { quest })
  });
};

exports.validate = method => {
  switch (method) {
    case "setQuest":
      return [
        body("quest", "Invalid quest")
          .isString()
          .exists()
          .withMessage("quest parameter is required")
      ];

    case "declineQuest":
      return [
        body("quest", "Invalid quest")
          .isString()
          .exists()
          .withMessage("quest parameter is required")
      ];

    case "getQuests":
        return [
          body("quest", "Invalid quest")
            .isString()
            .exists()
            .withMessage("quest parameter is required")
        ];
  }
};
