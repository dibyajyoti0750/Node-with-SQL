const express = require("express");
const path = require("path");
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "nodeSQL",
  password: "Dibyajyotipramanick",
});

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/users");
});

app.get("/users", (req, res) => {
  connection.query(`SELECT * FROM users`, (err, usersResult) => {
    if (err) {
      console.log(err);
      return res.send("Some error in DB");
    }

    connection.query(
      `SELECT COUNT(id) AS COUNT FROM users`,
      (err, countResult) => {
        if (err) {
          console.log(err);
          return res.send("Some error in DB");
        }

        let users = usersResult;
        let count = countResult[0].COUNT;

        res.render("home", { users, count });
      }
    );
  });
});

app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  connection.query(`SELECT * FROM users WHERE id = "${id}"`, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Some error in DB");
    }
    let user = result[0];
    console.log(user);
    res.render("edit", { user });
  });
});

app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, newUsername } = req.body;
  connection.query(`SELECT * FROM users WHERE id = "${id}"`, (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Some error in DB");
    }

    let user = result[0];
    if (formPass !== user.password) {
      return res.send("Wrong Password!");
    }

    let q = `UPDATE users SET username = "${newUsername}" WHERE id = "${id}"`;
    connection.query(q, (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Some error in DB");
      }
      res.redirect("/users");
    });
  });
});

app.get("/users/new", (req, res) => {
  res.render("new");
});

app.post("/users", (req, res) => {
  let id = uuidv4();
  let { username, email, avatar, password } = req.body;
  connection.query(
    "INSERT INTO users VALUES (?, ?, ?, ?, ?)",
    [id, username, email, avatar, password],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Some error in DB");
      }
      res.redirect("/users");
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// let createRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.image.avatar(),
//     faker.internet.password(),
//   ];
// };

// let q = `INSERT INTO users (id, username, email, avatar, password) VALUES ?`; // (VALUES ?) expects a nested array, each sub-array represents a row of values
// let data = [];

// for (let i = 0; i < 100; i++) {
//   data.push(createRandomUser());
// }

// connection.query(q, [data], (err, result) => {
//   if (err) {
//     console.error("Error:", err);
//   } else {
//     console.log("Inserted Rows:", result.affectedRows);
//   }
//   connection.end(); // Ensures connection closes only after the query finishes
// });
