const router = require("express").Router();
const authenticate = require("../../middleware/authenticateRequest");
const validate = require("../../middleware/validateRequest");
const CharacterController = require("../../controllers/Characters");

router.use("/quests", require("./quests"));

router.post("create", [
  authenticate,
  CharacterController.validate("createCharacter"),
  validate,
  CharacterController.createCharacter
]);

router.put("change", [
  authenticate,
  CharacterController.validate("changeCharacter"),
  validate,
  CharacterController.changeCharacter
]);

module.exports = router;
