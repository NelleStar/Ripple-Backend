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
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process if unable to connect to the database
  });

// Handle errors during the database connection
db.on("error", (err) => {
  console.error("Database connection error:", err);
  db.end(); // Close the connection if an error occurs
});

module.exports = db;
