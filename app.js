const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const app = express();

const con = mysql.createConnection(process.env.DB_HOST);

con.connect((err) => {
  if (err) throw err;
  console.log("Successfully connected to DB");
});

app.use(bp.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/", (req, res) => {
  console.log(req.body);
});

app.listen(
  process.env.SERVER_PORT || 3001,
  console.log("This server is running at: " + (process.env.SERVER_PORT || 3001))
);
