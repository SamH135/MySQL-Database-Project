const express = require('express');
const authController = require('../controllers/auth')
const router = express.Router();


router.post('/register', authController.register )

router.post('/login', authController.login )

router.post('/dashboard', authController.dashboard )

router.post('/inventory', authController.inventory )

router.post('/updateStock', authController.inventory )

router.post('/addUpdatedStock', authController.addUpdatedStock )

router.post('/placeOrder', authController.placeOrder )

router.post('/userManagement', authController.userManagement )

router.post('/addUser', authController.addUser )

router.post('/removeUser', authController.removeUser )

router.post('/editUser', authController.editUser )


module.exports = router;





