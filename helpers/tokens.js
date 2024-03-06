const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// return signed JWT from user data.
function createToken(user) {
  let payload = {
    username: user.username,
    // add other properties from the user if needed - for now start here
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
