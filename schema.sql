DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue", "Paint", 50, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Red", "Paint", 50, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Green", "Paint", 50, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yellow", "Paint", 50, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Black", "Paint", 50, 100);