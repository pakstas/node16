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

con.query("SHOW tables like 'scores'", (err, result) => {
  if (err) {
    throw err;
  } else if (result.length === 0) {
    con.query(
      "CREATE TABLE scores (id INT AUTO_INCREMENT PRIMARY KEY, name TEXT, subject TEXT, module TEXT, score INT)",
      (err, result) => {
        if (err) throw err;
        console.log("Lentele scores sukurta!");
      }
    );
  } else {
    console.log("score lenteliu yra: " + result.length);
  }
});

app.use(bp.json());
app.use(cors());

app.get("/", (req, res) => {
  con.query("SELECT * FROM scores", (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("NOT OK");
    } else {
      res.json(result);
    }
  });
});

function validInput(data) {
  return (
    data.name.trim(" ") !== "" &&
    data.subject.trim(" ") !== "" &&
    data.module.trim(" ") !== "" &&
    data.score >= 0 &&
    data.score <= 100 &&
    Number.isInteger(data.score)
  );
}

app.post("/", (req, res) => {
  if (validInput(req.body)) {
    con.query(
      `INSERT INTO scores (name, subject, module, score) VALUES ('${
        req.body.name
      }', '${req.body.subject}', '${req.body.module}', '${Number(
        req.body.score
      )}')`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send("NOT OK");
        } else {
          res.send("OK");
        }
      }
    );
  } else {
    res.status(400).send("NOT OK");
  }
});

app.listen(
  process.env.SERVER_PORT || 3001,
  console.log("This server is running at: " + (process.env.SERVER_PORT || 3001))
);
