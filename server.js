"use strict";

// ===================================================
const express = require("express");

const app = express();

// to parse JSON
app.use(express.json());
//to parse form data
app.use(express.urlencoded({ extended: true }));

//eventually move to routes folder
app.get("/", (req, res) => {
  console.log("You are at the homepage");
  return res.json("HOMEPAGE");
});

app.get("/users", (req, res) => {
  console.log("You want users?");
  return res.json("Here is the users page!");
});

//req.query examply
app.get("/search", (req, res) => {
  // term and sort are the parameters - can be anything we need but this is the example - can pass in defaults in the destructurting of it
  const { term = "piggies", sort = "top" } = req.query;
  return res.json(`SEARCH PAGE! term is:${term} and sort is:${sort}`);
});

//req.headers
app.get("/show-me-headers", (req, res) => {
  // console.log(req.rawHeaders)
  // console.log(req.headers)
  const lang = req.headers["accept-language"];
  return res.json(`Your language preference is: ${lang}`);
});

// req.body with a .status() added for
app.post("/register", (req, res) => {
  res.status(201).json(`Welcome, ${req.body.username}!!!`);
});

app.listen(3000, function () {
  console.log("Server on port 3000");
});
