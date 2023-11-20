-- Insert data into the Inventory table
INSERT INTO Inventory (ProductID, ProductName, Quantity)
VALUES
    (1, 'ProductA', 100),
    (2, 'ProductB', 75),
    (3, 'ProductC', 200),
    (4, 'ProductD', 50),
    (5, 'ProductE', 300);

-- Insert data into the User table
INSERT INTO `User` (UserID, JobTitle, FirstName, LastName, UserPassword)
VALUES
    (1, 'Manager', 'John', 'Doe', 'password1'),
    (2, 'Employee', 'Jane', 'Smith', 'password2'),
    (3, 'Employee', 'Michael', 'Johnson', 'password3'),
    (4, 'Supervisor', 'Emily', 'Williams', 'password4'),
    (5, 'Employee', 'William', 'Brown', 'password5');

-- Insert data into the Manufacturer table
INSERT INTO Manufacturer (ManufacturerID, MName, Phone, Email)
VALUES
    (1, 'ManufacturerA', '123-456-7890', 'manufacturerA@example.com'),
    (2, 'ManufacturerB', '987-654-3210', 'manufacturerB@example.com'),
    (3, 'ManufacturerC', '555-123-4567', 'manufacturerC@example.com'),
    (4, 'ManufacturerD', '777-888-9999', 'manufacturerD@example.com'),
    (5, 'ManufacturerE', '111-222-3333', 'manufacturerE@example.com');

-- Insert data into the Product table
INSERT INTO Product (ProductID, PName, Price, PDescription)
VALUES
    (1, 'ProductA', 25.99, 'DescriptionA'),
    (2, 'ProductB', 19.95, 'DescriptionB'),
    (3, 'ProductC', 34.50, 'DescriptionC'),
    (4, 'ProductD', 15.75, 'DescriptionD'),
    (5, 'ProductE', 49.99, 'DescriptionE');

-- Insert data into the Supplies table
INSERT INTO Supplies (ProductID, ProductName, ManufacturerID)
VALUES
    (1, 'ProductA', 1),
    (2, 'ProductB', 2),
    (3, 'ProductC', 3),
    (4, 'ProductD', 4),
    (5, 'ProductE', 5);

-- Insert data into the Orders table
INSERT INTO Orders (OrderID, OrderDate, Quantity, UserID, ProductID)
VALUES
    (1, '2023-01-15', 5, 1, 2),
    (2, '2023-01-16', 10, 2, 4),
    (3, '2023-01-17', 3, 1, 1),
    (4, '2023-01-18', 8, 3, 3),
    (5, '2023-01-19', 12, 4, 5);
