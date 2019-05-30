var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");

var newStock;


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {

  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    inquirer
    .prompt([
      {
        name: "start",
        type: "list",
        choices: ["Start", "Exit"],
        message: "Chose 'Start' to take a look at our available products."
      }
    ])
    .then(function(answer) {
      if (answer.start === "Exit") {
        connection.end();
      }
      else {
        console.table(results);
        questions(results);
      }
    })
  })
}

function questions(res) {
  inquirer
    .prompt([
      {
        name: "id",
        type: "number",
        message: "What is ID of the product you would like to purchase?"
      },
      {
        name: "quantity",
        type: "number",
        message: "How many units would you like to purchase?"
      }
    ])
    .then(function(answer) {
      var id = answer.id;
      var quantity = answer.quantity;
      var chosenItem;

      for (var i = 0; i < res.length; i++) {
        if (res[i].item_id === id) {
          chosenItem = res[i];
        }
      }

      if (chosenItem.stock_quantity > 0) {
        if (quantity <= chosenItem.stock_quantity) {
          newStock = chosenItem.stock_quantity - quantity;
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newStock
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw error;
            }
          );
          console.log("Your total purchase is: $" + (chosenItem.price * quantity));
          shopAgain();
        }
        else {
          console.log("Insufficient quantity");
          start();
        }
      }
      else {
        console.log("Insufficient quantity");
        start();
      }
    })
}

function shopAgain() {
  inquirer
    .prompt([
      {
        name: "continue",
        type: "list",
        choices: ["Yes", "No"],
        message: "Would you like to purchase another item?"
      }
    ])
    .then(function(answer) {
      if (answer.continue === "Yes") {
        connection.query("SELECT * FROM products", function(err, response) {
          if (err) throw err;
          console.table(response);
          questions(response);
        })
      }
      else {
        connection.end();
      }
    })
}
