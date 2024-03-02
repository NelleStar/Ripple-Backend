"use strict";

// Load dotenv with the config() function to keep API keys or DB credentials secret
require("dotenv").config();
// Require colors for enhanced readability
require("colors");

// Define secret key
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// Define port - if set, use the env variable; otherwise, default to 3001
//// '+' converts the string to a number
const PORT = +process.env.PORT || 3001;

// Use the dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "ripple_test"
    : process.env.DATABASE_URL || "ripple"; 
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Console log for confirmation
console.log("Ripple Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

// Export for use in other files
module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
