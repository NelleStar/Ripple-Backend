"use strict";

// Load dotenv with the config() function to keep API keys or DB credentials secret
require("dotenv").config();
// Require colors for enhanced readability
require("colors");

// Define secret key
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// Get database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const TEST_DB_URL = process.env.TEST_DB_URL;

// Define port - if set, use the env variable; otherwise, default to 3001
//// '+' converts the string to a number
const PORT = +process.env.PORT || 3001;

// Use the dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? TEST_DB_URL || "ripple_test"
    : DATABASE_URL || "ripple";
}


// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Export for use in other files
module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
