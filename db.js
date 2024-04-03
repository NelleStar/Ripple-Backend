"use strict";

//DB setup
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri(),
  });
}

// Connect to the database
db.connect()
  .then(() => {
    // console.log("Connected to the database");
  })
  .catch((err) => {
    process.exit(); 
  });

// Handle errors during the database connection
db.on("error", (err) => {
  db.end(); 
});

module.exports = db;
