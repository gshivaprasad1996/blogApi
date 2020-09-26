const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UsersController')

router.get('/login', UserController.login)

router.post('/signUp', UserController.signUp)


module.exports = router;