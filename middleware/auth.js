"use strict";
//Convenience middleware to handle common auth cases in routes.

// require jwt in package.json, and import the secret_key from config and UnauthorizedError from expressError
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

// Middleware: Authenticate user
// If a token was provided, verify it, and if valid, store the token payload on res.locals
// It's not an error if no token was provided or if the token is not valid.
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    // res.locals.user = {};
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const user = jwt.verify(token, SECRET_KEY);
      res.locals.user = user;
    }
    next();
  } catch (err) {
    // If token verification fails, proceed without setting res.locals.user
    next();
  }
}


// Middleware to use when they must be logged in. If not, raises Unauthorized.
function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

// Middleware to use when they must provide a valid token & be user matching username provided as route param. If not, raises Unauthorized
function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    const usernameFromToken = user && user.username;

    // Check if the username from the token matches the username from the route parameter
    if (!(usernameFromToken)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
};
