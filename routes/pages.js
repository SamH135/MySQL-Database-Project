const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth'); // Adjust the path based on your actual folder structure

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/dashboard", authController.dashboard)


router.get("/inventory", authController.inventory)


router.get("/updateStock", authController.updateStock)


router.get("/placeOrder", authController.placeOrder)


router.get("/userManagement", authController.userManagement)


module.exports = router;
