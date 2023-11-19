const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// create database connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
}); 


exports.register = (req, res) => {
    //console.log(req.body);

    const {userID, firstName, lastName, jobTitle, password, passwordConfirm} = req.body;


    db.query('SELECT UserID FROM user WHERE userID = ?', [userID], async (error, result) => {
        if(error) {
            console.log(error);
        }

        if(result.length > 0) {
            return res.render('register', {
                message: 'User ID already exists'
            })
        } else if( password !== passwordConfirm) {
            return res.render('register', {
                message: "Passwords do not match"
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);


        db.query('INSERT INTO user SET ?', {UserID: userID, FirstName: firstName, LastName: lastName, JobTitle: jobTitle, UserPassword: hashedPassword}, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                return res.render('register', {
                    message: 'Successfully registered!'
                })
            }


        })

    })


    
} // end of register


exports.login = (req, res) => {

    //console.log(req.body);

    const { userID, password } = req.body;

    db.query("SELECT * FROM user WHERE userID = ?", [userID], async (err, results) => {
        
        //console.log(results);

        if (err) {
            console.log("ERROR: " + err)
        }
        if (results.length == 0) {
            return res.render('login', {
                message: 'That ID has not been registered yet'
            })
        }

        let match = await bcrypt.compare(password, results[0].UserPassword);

        if (match) {
            // Store user information in the session
            req.session.userID = userID;
            req.session.jobTitle = results[0].JobTitle;

            return res.render('dashboard', { jobTitle: results[0].JobTitle });
        } else {
            return res.render('login', {
                message: 'Invalid password'
            });
        }
    })
} // end of login


exports.dashboard = (req, res) => {
    // Access user information from the session
    const { userID, jobTitle } = req.session;

    if (!userID || !jobTitle) {
        // Redirect to login if user information is not found in the session
        return res.redirect('/login');
    }

    // Render the dashboard with user information
    return res.render('dashboard', { jobTitle });
    
} // end of dashboard


exports.inventory = (req, res) => {
    const query = `
        SELECT i.ProductName, p.PDescription, p.Price, i.Quantity
        FROM Inventory i
        JOIN Product p ON i.ProductID = p.ProductID
    `;

    db.query(query, (err, results) => {

        // Access user information from the session
        const { jobTitle } = req.session;
        if (err) {
            console.error('Error fetching data from the database:', err);
            // Handle the error appropriately, e.g., render an error page
        } else {
            // Render a view to present the result
            return res.render('inventory', { inventoryData: results, jobTitle });
        }
    });

} // end of inventory


exports.updateStock = (req, res) => {
    const query = 'SELECT ProductID, PName FROM Product';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching products:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Access user information from the session if needed
        const { jobTitle } = req.session;

        //console.log('Product Data:', results);

        // Render the updateStock view with the product data
        return res.render('updateStock', { productData: results, jobTitle });
    });

} // end of updateStock


exports.addUpdatedStock = (req, res) => {
    const { product, quantity } = req.body;

    // Split the product string into ProductID and PName
    const [ProductID, PName] = product.split(':');
    // Check if the product exists in the Product table
    const checkProductQuery = 'SELECT COUNT(*) AS count FROM Product WHERE ProductID = ? AND PName = ?';
    const checkProductData = [ProductID, PName];

    db.query(checkProductQuery, checkProductData, (error, results) => {
        if (error) {
            console.error('Error checking product:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        const productExists = results[0].count > 0;

        if (!productExists) {
            return res.status(404).send('Product not found');
        }

        // Insert or update the data in the Inventory table, incrementing the Quantity
        const upsertQuery = `
            INSERT INTO Inventory (ProductID, ProductName, Quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE Quantity = Quantity + ?`;

        const inventoryData = [ProductID, PName, quantity, quantity];

        db.query(upsertQuery, inventoryData, (error, results) => {
            if (error) {
                console.error('Error updating inventory:', error);
                res.status(500).send('Internal Server Error');
                return;
            }

            return res.render('updateStock', {
                message: 'Successfully updated!'
            });
        });
    });
};


// exports.placeOrder = (req, res) => {
//     const query = 'SELECT ProductID, PName FROM Product';

//     db.query(query, (error, results) => {
//         if (error) {
//             console.error('Error fetching products:', error);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         // Access user information from the session if needed
//         const { jobTitle } = req.session;

//         //console.log('Product Data:', results);

//         // Render the updateStock view with the product data
//         return res.render('placeOrder', { productData: results, jobTitle });


//     });
// };

// // Handle form submission to add orders
// exports.submitOrder = (req, res) => {
//     const { product, quantity } = req.body;
//     const [productID, productName] = product.split(':');
//     const userID = req.session.userID; // Assuming userID is stored in the session

//     const insertOrderQuery = `
//         INSERT INTO Orders (OrderDate, Quantity, UserID, ProductID)
//         VALUES (CURDATE(), ?, ?, ?)`;

//     const orderParams = [quantity, userID, productID];

//     db.query(insertOrderQuery, orderParams, (error, results) => {
//         if (error) {
//             console.error('Error inserting order:', error);
//             res.status(500).send('Internal Server Error');
//             return;
//         }

//         // Redirect back to the placeOrder page after submitting the order
//         res.redirect('/placeOrder');
//     });
// };

// exports.showOrders = (req, res) => {
//     const getOrders = () => {
//         return new Promise((resolve, reject) => {
//             db.query('SELECT * FROM Orders', (error, results) => {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve(results);
//                 }
//             });
//         });
//     };

//     getOrders()
//         .then(orders => {
//             res.render('PlaceOrder', { orders });
//         })
//         .catch(error => {
//             console.error('Error retrieving orders:', error);
//             res.status(500).send('Internal Server Error');
//         });
// };

// Function to insert a new order into the database
function insertOrder(orderDate, quantity, userID, productID) {
    return new Promise((resolve, reject) => {
        const insertOrderQuery = `
            INSERT INTO Orders (OrderDate, Quantity, UserID, ProductID)
            VALUES (?, ?, ?, ?)`;

        const orderParams = [orderDate, quantity, userID, productID];

        db.query(insertOrderQuery, orderParams, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Function to get all orders from the database
function getOrders() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Orders', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Function to fetch product data
function getProducts() {
    return new Promise((resolve, reject) => {
        db.query('SELECT ProductID, PName FROM Product', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

exports.placeOrder = async (req, res) => {
    try {
        // Fetch order data
        const orders = await getOrders();

        // Fetch product data
        const productData = await getProducts();

        // Access user information from the session if needed
        const { jobTitle } = req.session;

        // Render the placeOrder view with the order and product data
        res.render('placeOrder', { orders, productData, jobTitle });
    } catch (error) {
        console.error('Error fetching orders or products:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.submitOrder = async (req, res) => {
    const { product, quantity } = req.body;
    const [productID, productName] = product.split(':');
    const userID = req.session.userID; // Assuming userID is stored in the session
    const orderDate = new Date().toISOString().slice(0, 10);

    try {
        // Insert the order into the database
        await insertOrder(orderDate, quantity, userID, productID);

        // Get the updated list of orders
        const orders = await getOrders();

        // Render the placeOrder view with the list of orders
        res.render('placeOrder', { orders });
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.showOrders = async (req, res) => {
    try {
        // Get the list of orders
        const orders = await getOrders();

        // Render the placeOrder view with the list of orders
        res.render('placeOrder', { orders });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).send('Internal Server Error');
    }
};






































function getUsers(){

    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM User', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};




exports.userManagement = (req, res) => {
    const { jobTitle } = req.session;
    //return res.render('userManagement', {jobTitle})


    const getUsers = () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM User', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    // Call the getUsers function and render the userManagement.hbs template with the retrieved users
    getUsers()
        .then(users => {
            res.render('userManagement', { users, jobTitle });
        })
        .catch(error => {
            console.error('Error retrieving users:', error);
            res.status(500).send('Internal Server Error');
        });
        
} // end of userManagement

function insertUser(userID, firstName, lastName, jobTitle, hashedPassword){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO user SET ?', {UserID: userID, FirstName: firstName, LastName: lastName, JobTitle: jobTitle, UserPassword: hashedPassword}, (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log('else')
                resolve(results);
            }
        });
    });
}


exports.addUser = async (req, res) => {
    const {userID, firstName, lastName, jobTitle, password, passwordConfirm} = req.body;
    //console.log(req.body);

    db.query('SELECT UserID FROM user WHERE userID = ?', [userID], async (error, result) => {
        if(error) {
            console.log(error);
        }

        if(result.length > 0) {
            return res.render('userManagement', {
                message: 'User ID already exists',
                users: users,
                jobTitle: jobTitle
            })
        } else if( password !== passwordConfirm) {
            return res.render('userManagement', {
                message: "Passwords do not match",
                users: users,
                jobTitle: jobTitle
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        //console.log(hashedPassword);

        let insert = await insertUser(userID, firstName, lastName, jobTitle, hashedPassword);
        let users = await getUsers()
        console.log(users)

        return res.render('userManagement', {
            message: 'Added new user: ' + firstName + ' ' + lastName,
            users: users,
            jobTitle: jobTitle
        })

        // })

    })
} // end of addUser


exports.removeUser = async (req, res) => {
    const { userIDRemove } = req.body;

    try {
        // Perform validation as needed

        // Execute the query to remove the user
        await removeUserQuery(userIDRemove);

        // Get the updated list of users
        const users = await getUsers();

        // Render the page with the updated user list
        return res.render('userManagement', {
            message: 'User removed successfully!',
            users: users
        });
    } catch (error) {
        console.error('Error removing user:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.editUser = async (req, res) => {
    const { userIDEdit, jobTitleEdit, firstNameEdit, lastNameEdit, userPasswordEdit } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(userPasswordEdit, 8);

        // Execute the query to edit the user
        await editUserQuery(userIDEdit, jobTitleEdit, firstNameEdit, lastNameEdit, hashedPassword);

        // Get the updated list of users
        const users = await getUsers();

        // Render the page with the updated user list
        return res.render('userManagement', {
            message: 'User edited successfully!',
            users: users
        });
    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to remove a user from the database
function removeUserQuery(userID) {
    return new Promise((resolve, reject) => {
        const removeUserQuery = 'DELETE FROM User WHERE UserID = ?';
        const removeUserParams = [userID];

        db.query(removeUserQuery, removeUserParams, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// Function to edit a user in the database
function editUserQuery(userID, jobTitle, firstName, lastName, hashedPassword) {
    return new Promise((resolve, reject) => {
        const editUserQuery = `
            UPDATE User
            SET JobTitle = ?, FirstName = ?, LastName = ?, UserPassword = ?
            WHERE UserID = ?`;

        const editUserParams = [jobTitle, firstName, lastName, hashedPassword, userID];

        db.query(editUserQuery, editUserParams, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}




