const jwt = require("jsonwebtoken");
const config = require("../config/database");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const auth = {};
  const authData = req.headers.authorization;

  if (!authData) return res.status(401).send({ message: "Token invalid" });

  auth.type = authData.split(" ")[0];
  auth.token = authData.split(" ")[1];

  try {
    const jwtPayload = jwt.decode(auth.token, config.secret);
    const user = await User.findById(jwtPayload.id)
      .populate()
      .exec();

    if (jwtPayload.verify !== user.tokenVerify)
      return res.status(401).send({ ok: false, message: "Token invalid" });

    if (!user) return res.status(401).send({ message: "User does not exists" });
    req.user = user;
    req.setLocale(user.locale);
  } catch (e) {
    if ((e.message = "Cannot read property 'id' of null"))
      return res.status(401).send({ message: "Token invalid" });
  }

  next();
};
