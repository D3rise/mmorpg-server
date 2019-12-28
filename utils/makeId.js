const flakeIdgen = require("flake-idgen");
const intformat = require("biguint-format");
const flakeIdGen = new flakeIdgen();

module.exports = () => intformat(flakeIdGen.next(), "dec");
