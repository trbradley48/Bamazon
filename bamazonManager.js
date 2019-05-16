var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");

var quantity = [];


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "yUklown7994",
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

    // Store quantities for each product (this will be useful for 'adding inentory')
    for (i = 0; i < results.length; i++) {
      quantity[i] = results[i].stock_quantity;
    }

    inquirer
      .prompt([
        {
          name: "start",
          type: "list",
          choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
          message: "What would you like to do?"
        }
      ])
      .then(function (answer) {
        if (answer.start === "View Products") {

          //Display table
          console.table(results);
          restart();
        }
        else if (answer.start === "View Low Inventory") {

          //Query db for inventory items with 5 or less quantity
          connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5", function (err, results) {
            if (err) throw err;

            console.table(results);
            restart();
          })
        }
        else if (answer.start === "Add to Inventory") {

          console.table(results);

          //Add quantity to Inventory
          inquirer
            .prompt([
              {
                name: "selectedItem",
                type: "input",
                message: "Which ID would you like to add inventory to?"
              },
              {
                name: "quantityAdded",
                type: "number",
                message: "How many much more would you like to add?"
              }
            ])
            .then(function (response) {

              var index = response.selectedItem - 1;
              connection.query("UPDATE products SET ? WHERE ? ",
                [
                  {
                    stock_quantity: (quantity[index] + response.quantityAdded)
                  },
                  {
                    item_id: response.selectedItem
                  }
                ],
                function (err) {
                  if (err) throw err;
                  console.log("Table updated!");
                  restart();
                })
            })
        }
        else if (answer.start === "Add New Product") {

          //Add new item to inventory
          inquirer
            .prompt([
              {
                name: 'productName',
                type: 'input',
                message: 'What is the name of the product?'
              },
              {
                name: 'departmentName',
                type: 'input',
                message: 'Which department is this product in?'
              },
              {
                name: 'price',
                type: 'number',
                message: 'How much does this product cost?'
              },
              {
                name: 'quantity',
                type: 'number',
                message: 'How many are in stock?'
              }
            ])
            .then(function (response) {
              connection.query("INSERT INTO products SET ? ",
                  {
                    product_name: response.productName,
                    department_name: response.departmentName,
                    price: response.price,
                    stock_quantity: response.stock
                  },
                function (err) {
                  if (err) throw err;
                  console.log("Product added");
                  restart();
                })
            })
        }
        else {
          connection.end();
        }
      })
  })
}

// Restart the program
function restart() {
  inquirer
    .prompt([
      {
        name: 'restart',
        type: 'list',
        choices: ['Yes', 'No'],
        message: "Would you like to do something else?"
      }
    ])
    .then(function (response) {
      if (response.restart === 'Yes') {
        start();
      }
      else {
        connection.end();
      }
    })
}