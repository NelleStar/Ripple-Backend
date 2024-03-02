// catches commong coding errors for more secure JS
"use strict";

// import express framework
const express = require("express");
// import cors middleware (Cross Origin Resource Sharing)
const cors = require("cors");

// import custom error class from expressError
const { NotFoundError } = require("./expressError");

// need to import our routes/functions for the app here - currently not built
// const { authenticateJWT } = require("./middleware/auth");
// const authRoutes = require("./routes/auth");
// const usersRoutes = require("./routes/users");

// import morgan for logging HTTP requests
const morgan = require("morgan");

// create instance of express app saved to 'app'
const app = express();

// set up CORS, parse JSON requests, log HTTP requests and authenticate 
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
// app.use(authenticateJWT);

// specify routes to be used for application - not currently set up
// app.use("/auth", authRoutes);
// app.use("/users", usersRoutes);


//Handle 404 errors -- this matches everything ---creates and passes instance to next middleware
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// Generic error handler; anything unhandled goes here. error stack 
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

// exports the app instance to be imported and used in other files
module.exports = app;
