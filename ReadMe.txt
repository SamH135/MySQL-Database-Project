index.ejs:
    - Driver/menu for the webpage


ViewInventory.ejs:
    - Displays all inventory items in a table format, with options to add or delete an item from the database


PlaceOrders.ejs:
    - Allows the user to place an order and define a quantity for that order
    - Needs to check if a user is a manager before allowing to place order


UpdateStock.ejs:
    - Allows the user to update stock levels of products in the inventory


UserManagement.ejs:
    - Page where users can be added, edited or deleted from the system


AdminLogin.ejs:
    - Login page for admin access
    - Will be required to access UserManagement


styles.css:
    - CSS file used by HTML files for basic font/color choices 


BackEnd.js:
    - Contains functions related to backend operations (establish DB connection, 
      view tables, insert values, etc)
    

    SET UP:
    To set up this project you will need NodeJS installed on your computer. 

    In the terminal
    npm install express
    npm install mysql2
    npm install ejs

    npm start

    Modify the database connection block of code to contain information 
    specific to your sql database that you have running on your own machine.
    
    host: '127.0.0.1',
    user: 'root',
    password: 'your password',
    database: 'your database name',


