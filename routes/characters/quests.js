const QuestController = require("../../controllers/Quests");
const validate = require("../../middleware/validateRequest");
const authenticate = require("../../middleware/authenticateRequest");
const router = require("express").Router();

router.get("/quests", [
  authenticate,
  QuestController.validate("getQuests"),
  validate,
  QuestController.getQuests
]);

router.post("/change", [
  authenticate,
  QuestController.validate("setQuest"),
  validate,
  QuestController.setQuest
]);

router.post("/decline", [
  authenticate,
  QuestController.validate("declineQuest"),
  validate,
  QuestController.declineQuest
]);

module.exports = router;
