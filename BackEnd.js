const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Serve static files (CSS, JavaScript, etc.)
app.use(express.static('public'));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: '4347_project',
});

// Use body-parser middleware for handling form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Use express-session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Handle POST request for user login
app.post('/login', (req, res) => {
    //const { uname, psw } = req.body;
    const uname = req.body.uname;
    const psw = req.body.psw
    console.log(uname)
    // Validate user credentials (you may want to hash passwords for security)
    // For simplicity, we're using plaintext passwords here
    const query = `
        SELECT * FROM User
        WHERE UserID = ? AND UserPassword = ?;
    `;

    db.query(query, [uname, psw], (err, results) => {
        console.log(results)
        if (err) {
            console.log('Error querying database for login:'+ err);
            //res.json({success: false})
        } else {
            if (results.length > 0) {
                // Valid login

                
                // console.log('entered if 1')
                // req.session.user = results[0]; // Set the user in the session
                // console.log(req.session.user)
                res.render('dashboard'); //, { user: results[0] }); // Pass user data to the dashboard or another page
                console.log('entered if 1.0101')
            } else {
                // Invalid login
                console.log('entered else 1')
                //res.json({success: false})
                res.redirect('/'); // Redirect to the login page
            }
        }
    });
});

app.get('/dashboard', (req, res) => {
    console.log(req.session.user);
  
    if (req.session.user) {
      // Render the dashboard template
      res.render('dashboard', { user: req.session.user });
    } else {
      // Redirect to the login page
      res.redirect('/');
    }
  });

// Route for rendering index.ejs
app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('index', { user });
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






// Define routes
// app.get('/view-inventory', (req, res) => {
//     // Render the 'ViewInventory.ejs' template
//     res.render('ViewInventory');
// });

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




app.get('/view-inventory', (req, res) => {
    // Fetch data from the Inventory and Product tables
    const query = `
        SELECT i.ProductName, p.PDescription, p.Price, i.Quantity
        FROM Inventory i
        JOIN Product p ON i.ProductID = p.ProductID
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from the database:', err);
            // Handle the error appropriately, e.g., render an error page
        } else {
            res.render('ViewInventory', { inventoryData: results });
        }
    });
});




// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
