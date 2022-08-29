const express = require("express");
const app = express();
const port = 3000;

const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = lowdb(adapter);

const cors = require("cors");
const lodash = require("lodash");
// const request = require("request");
const { faker } = require("@faker-js/faker");

// Data parser used to parse POST requests
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ---------------------------------------------------------------
// configure express to serve static files from public directory
// ---------------------------------------------------------------
app.use(express.static("public"));

// --------------------------------------
// initialize database
// --------------------------------------
db.defaults({ users: [] }).write();

// -------------------------------------------
// Get All Users & Return All Users to Client
// -------------------------------------------
app.get("/users", (req, res) => {
  const users = db.get("users").value();
  res.send(users);
});

// --------------------------------------
// POST TEST
// --------------------------------------
app.post("/test", (req, res) => {
  console.log(req.body.username, req.body.password);
  res.send(`${req.body.username} ${req.body.password}`);
});

// --------------------------------------
// Add User to DB
// Send back to Client list of all users
// DB only add parameters that are filled out (no NULLs)
// But when called, the parameters NOT filled out will be present with a value of 'undefined'
// --------------------------------------
app.post("/add", (req, res) => {
  console.log("posting...add user");

  const user = {
    name: req.body.name,
    dob: req.body.dob,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
    citystatezip: req.body.citystatezip,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    avatar: faker.internet.avatar(),
  };

  db.get("users").push(user).write();
  //   console.log(db.get("users").value());

  res.send(db.get("users").value());
});

// --------------------------------------
// Start Server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
