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
    console.log("Entering authenticateJWT middleware");
    const authHeader = req.headers && req.headers.authorization;
    res.locals.user = {};
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const user = jwt.verify(token, SECRET_KEY);
      res.locals.user = user;
      console.log(`user:`, user)
    }
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    // If token verification fails, proceed without setting res.locals.user
    next();
  }
}


// Middleware to use when they must be logged in. If not, raises Unauthorized.
function ensureLoggedIn(req, res, next) {
  try {
    console.log("Entering ensureLoggedIn middleware");

    if (!res.locals.user) {
      console.log("User not logged in");
      throw new UnauthorizedError();
    }
    console.log("Authenticated user:", res.locals.user.username);
    return next();
  } catch (err) {
    return next(err);
  }
}

// Middleware to use when they must provide a valid token & be user matching username provided as route param. If not, raises Unauthorized
function ensureCorrectUser(req, res, next) {
  try {
    console.log("Entering ensureCorrectUser middleware");
    const user = res.locals.user;
    const usernameFromToken = user && user.username;


    console.log('user:', user, 'usernameFromToken:', usernameFromToken)

    // Check if the username from the token matches the username from the route parameter
    if (!(usernameFromToken)) {
      console.log("User not authorized to access this resource");
      throw new UnauthorizedError();
    }

    // Proceed to the next middleware or route handler
    console.log("User authorized");
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
