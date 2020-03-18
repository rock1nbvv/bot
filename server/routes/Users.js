const express = require("express");
const router = express.Router();
const passport = require("passport");
const {check} = require('express-validator');

const {createUser, logInUser} = require('../controllers/Users');


// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/',
    [
        check("password", "Password is required")
            .not()
            .isEmpty(),
        check("firstName", "firstName is required")
            .not()
            .isEmpty(),
        check("lastName", "lastName is required")
            .not()
            .isEmpty(),
        check("middleName", "middleName is required")
            .not()
            .isEmpty(),
        check("login", "login is required")
            .not()
            .isEmpty()
    ],
    createUser
);


// @route   GET api/users
// @desc    LogIn user
// @access  Public
router.post('/login',
    [
        check("password", "Password is required")
            .not()
            .isEmpty(),
        check("login", "login is required")
            .not()
            .isEmpty()
    ],
    logInUser
);


module.exports = router;