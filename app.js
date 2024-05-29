const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();




// Use express-session middleware
app.use(session({
    secret: 'your-secret-key', // Use a strong, unique key for your session
    resave: true,
    saveUninitialized: true,
  }));


dotenv.config({ path: './.env'});


// create database connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(bodyParser.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false}));

// parse JSON bodies (as sent by API clients)
app.use(express.json());


const hbs = require('hbs');
hbs.registerHelper('equal', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});



// set handlebars as view engine

  
app.set('view engine', 'hbs');
app.use('/js', express.static(__dirname + '/public/js', { 'Content-Type': 'application/javascript' }));
app.use(bodyParser.json());

db.connect( (error) => {
    if(error) {
        console.log('Error connecting to database');
    } else {
        console.log('Connected to database');
    }
});



// Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
