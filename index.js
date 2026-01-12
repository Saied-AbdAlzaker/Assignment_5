const express = require("express");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Store",
});

connection.connect((err) => {
  if (err) {
    console.log("Error!", err);
  } else {
    console.log("DB connected.");
  }
});

const app = express();
const port = 3000;
app.use(express.json());
// Part 3
// 1- Create the required tables for the retail store database based on the tables structure and relationships.
app.post("/store", (req, res) => {
  connection.execute(
    `
    CREATE TABLE Suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierName VARCHAR(100),
    ContactNumber VARCHAR(20)
)`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );
  connection.execute(
    `
   CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100),
    Price DECIMAL(10,2),
    StockQuantity INT,
    SupplierID INT,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
)`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );
  connection.execute(
    `
   CREATE TABLE Sales (
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    QuantitySold INT,
    SaleDate DATE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
)`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  res.status(200).json("Table Created.");
});
// 2- Add a column “Category” to the Products table.
app.post("/add-category", (req, res) => {
  connection.execute(
    `
   ALTER TABLE products
   ADD Category VARCHAR(50)
`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  res.json("Category Added");
});
// 3- Remove the “Category” column from Products.
app.post("/delete-category", (req, res) => {
  connection.execute(
    `
   ALTER TABLE Products
   DROP COLUMN Category
`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  res.json("Category Deleted.");
});
// 4- Change “ContactNumber” column in Suppliers to VARCHAR (15).
app.post("/change-contact-number", (req, res) => {
  connection.execute(
    `
   ALTER TABLE Suppliers
   MODIFY ContactNumber VARCHAR(15)
`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  res.json("Change Contact Number Success.");
});
// 5- Add a NOT NULL constraint to ProductName.
app.post("/product-name", (req, res) => {
  connection.execute(
    `
    ALTER TABLE Products
    MODIFY ProductName VARCHAR(100) NOT NULL
`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  res.json("Change product-name not-null Success.");
});
// 6- Perform Basic Inserts:
// a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'.
app.post("/add-supplier", (req, res) => {
  connection.execute(
    `
    INSERT INTO Suppliers (SupplierName, ContactNumber)
    VALUES ('FreshFoods', '01001234567')
`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  res.json("Add supplier success.");
});
// b. Insert the following three products, all provided by 'FreshFoods':
// i. 'Milk' with a price of 15.00 and stock quantity of 50.
// ii. 'Bread' with a price of 10.00 and stock quantity of 30.
// iii. 'Eggs' with a price of 20.00 and stock quantity of 40.
app.post("/insert-product", (req, res) => {
  connection.execute(
    `
    INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
    VALUES('Milk', 15.00, 50, 1),('Bread', 10.00, 30, 1),('Eggs', 20.00, 40, 1);
`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  res.json("Insert the following three products success.");
});
// c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'.
app.post("/insert-sale", (req, res) => {
  connection.execute(
    `
    INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
    VALUES (1, 2, '2025-05-20')
`,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  res.json("Add a record for the sale success.");
});
// 7- Update the price of 'Bread' to 25.00.
app.post("/update-price", (req, res) => {
  connection.execute(
    `
        UPDATE products
        SET price = 25.00
        WHERE productName = 'Bread'
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("Update Price Success.");
});
// 8- Delete the product 'Eggs'.
app.post("/delete-product", (req, res) => {
  connection.execute(
    `
        DELETE FROM products
        WHERE productName = 'Eggs'
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("Deleted Product Success.");
});
// 9- Retrieve the total quantity sold for each product.
app.post("/retrieve-quantity", (req, res) => {
  connection.execute(
    `
        SELECT p.ProductName, SUM(s.QuantitySold) AS TotalSold
        FROM Products p
        LEFT JOIN Sales s ON p.ProductID = s.ProductID
        GROUP BY p.ProductName;
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("Retrieve the total quantity Success.");
});
// 10- Get the product with the highest stock.
app.post("/product-desc", (req, res) => {
  connection.execute(
    `
       SELECT ProductName, StockQuantity
       FROM Products
       ORDER BY StockQuantity DESC
       LIMIT 1
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("Get the product with the highest stock Success.");
});
// 11- Find suppliers with names starting with 'F'.
app.post("/find-supplier", (req, res) => {
  connection.execute(
    `
       SELECT *
       FROM Suppliers
       WHERE SupplierName LIKE 'F%'
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("Find Supplier Success.");
});
// 12- Show all products that have never been sold.
app.post("/all-products", (req, res) => {
  connection.execute(
    `
      SELECT p.ProductName
      FROM Products p
      LEFT JOIN Sales s ON p.ProductID = s.ProductID
      WHERE s.SaleID IS NULL
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("Show all products success.");
});
// 13- Get all sales along with product name and sale date.
app.post("/all-sales", (req, res) => {
  connection.execute(
    `
      SELECT p.ProductName, s.QuantitySold, s.SaleDate
      FROM Sales s
      JOIN Products p ON s.ProductID = p.ProductID
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("Show all sales success.");
});
// 14- Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables. 
app.post("/store_manager", (req, res) => {
  connection.execute(
    `
      GRANT SELECT, INSERT, UPDATE
      ON *.*
      TO 'store_manager'@'%';
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("store_manager success.");
});
// 15- Revoke UPDATE permission from “store_manager”. 
app.post("/revoke", (req, res) => {
  connection.execute(
    `
      REVOKE UPDATE
      ON *.*
      FROM 'store_manager'@'%';
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("REVOKE UPDATE success.");
});
// 16- Grant DELETE permission to “store_manager” only on the Sales table.
app.post("/delete-permission", (req, res) => {
  connection.execute(
    `
      GRANT DELETE
      ON Sales
      TO 'store_manager'@'%'
        `,
    (err, result) => {
      if (err) {
        return res.status(500).json({ errMsg: "DB error!", err });
      }
      console.log(result);
    }
  );

  return res.json("GRANT DELETE success.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
