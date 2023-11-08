const mysql = require('mysql2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');



const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: '4347_project',
});

// You can use the connect method to test the connection
db.connect((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    else{
        console.log('Connected to MySQL database');
    }
    
});




app.set('view engine', 'ejs'); // Replace 'ejs' with the name of your chosen template engine
app.set('views', path.join(__dirname, 'views')); // Specify the path to your views/templates directory



// Serve static files (CSS, JavaScript, etc.)
app.use(express.static('public'));

// Use body-parser middleware for handling form data
app.use(bodyParser.urlencoded({ extended: false }));



// Define routes
app.get('/view-inventory', (req, res) => {
    // Render the 'ViewInventory.ejs' template
    res.render('ViewInventory');
});

app.get('/place-orders', (req, res) => {
    // Render the 'PlaceOrders.ejs' template
    res.render('PlaceOrders');
});

app.get('/update-stock', (req, res) => {
    // Render the 'UpdateStock.ejs' template
    res.render('UpdateStock');
});

app.get('/user-management', (req, res) => {
    // Render the 'UserManagement.ejs' template
    res.render('UserManagement');
});

app.get('/Menu', (req, res) => {
    // Render the 'index.ejs' template
    res.render('index');
});




// app.get('/view-inventory', (req, res) => {
//     // Fetch data from the Inventory and Product tables
//     const query = `
//         SELECT i.ProductName, p.PDescription, p.Price, i.Quantity
//         FROM Inventory i
//         JOIN Product p ON i.ProductID = p.ProductID
//     `;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching data from the database:', err);
//             // Handle the error appropriately, e.g., render an error page
//         } else {
//             res.render('ViewInventory', { inventoryData: results });
//         }
//     });
// });








app.get('/', (req, res) => {
    
    // Render the 'index.ejs' template
    res.render('index');
});
    



// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
