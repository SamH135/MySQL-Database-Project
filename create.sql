-- Create the Product table 
CREATE TABLE Product (
    ProductID INT,
    PName VARCHAR(60),
    Price DECIMAL(10, 2),
    PDescription TEXT,
    PRIMARY KEY (ProductID, PName)
);

-- Create the Inventory table
CREATE TABLE Inventory (
    ProductID INT,
    ProductName VARCHAR(60),
    Quantity INT,
    PRIMARY KEY (ProductID, ProductName),
    FOREIGN KEY (ProductID, ProductName) REFERENCES Product(ProductID, PName)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create the User table
CREATE TABLE `User` (
    UserID INT PRIMARY KEY,
    JobTitle VARCHAR(80) DEFAULT 'Employee',
    FirstName VARCHAR(40),
    LastName VARCHAR(40),
    UserPassword VARCHAR(150) NOT NULL
);

-- Create the Manufacturer table
CREATE TABLE Manufacturer (
    ManufacturerID INT PRIMARY KEY,
    MName VARCHAR(60) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(50)
);

-- Create the Supplies table 
CREATE TABLE Supplies (
    ProductID INT,
    ProductName VARCHAR(60),
    ManufacturerID INT,
    PRIMARY KEY (ProductID, ProductName, ManufacturerID),
    FOREIGN KEY (ProductID, ProductName) REFERENCES Product(ProductID, PName)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (ManufacturerID) REFERENCES Manufacturer(ManufacturerID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create the Orders table 
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    OrderDate DATE NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    UserID INT DEFAULT NULL,
    ProductID INT DEFAULT NULL,
    FOREIGN KEY (UserID) REFERENCES `User`(UserID)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
