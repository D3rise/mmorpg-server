const router = require("express").Router();
const UserController = require("../../controllers/User");
const validate = require("../../middleware/validateRequest");
const authenticate = require("../../middleware/authenticateRequest");

router.get("/login", [
  UserController.validate("login"),
  validate,
  UserController.login
]);

router.post("/disable2fa", [
  authenticate,
  UserController.validate("disableTfa"),
  validate,
  UserController.disableTfa
]);

router.post("/enable2fa", [authenticate, UserController.enableTfa]);

router.post("/register", [
  UserController.validate("createUser"),
  validate,
  UserController.createUser
]);

router.put("/updateUser", [
  authenticate,
  UserController.validate("modifyUser"),
  validate,
  UserController.modifyUser
]);

router.get("/verify", [
  authenticate,
  UserController.validate("verifyUser"),
  validate,
  UserController.verifyUser
]);

module.exports = router;
