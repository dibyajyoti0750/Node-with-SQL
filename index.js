const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "nodeSQL",
  password: "Dibyajyotipramanick",
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
