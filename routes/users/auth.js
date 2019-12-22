const router = require("express").Router();
const UserController = require("../../controllers/User");
const validate = require("../../middleware/validateRequest");
const authenticate = require("../../middleware/authenticate");

router.get("/login", [
  UserController.validate("login"),
  validate,
  UserController.login
]);

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
