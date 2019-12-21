module.exports = {
  secret:
    process.env.NODE_ENV === "production"
      ? process.env.JWT_SECRET
      : "testsecret",
  database:
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URL
      : "mongodb://localhost/mmorpg-test"
};
