"use strict";

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

// Load variables from .env file
dotenv.config();

// Create instance of express app saved to 'app'
const app = express();

// Set up CORS, parse JSON requests, log HTTP requests, and authenticate
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Ensure that authenticateJWT middleware is executed before routes
app.use(authenticateJWT);

// Specify routes to be used for application
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

// Handle 404 errors
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// Generic error handler
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

// Export the app instance to be imported and used in other files
module.exports = app;
