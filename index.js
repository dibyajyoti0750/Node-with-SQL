const express = require("express");
const path = require("path");
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
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
