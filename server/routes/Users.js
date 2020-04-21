const express = require("express");
const router = express.Router();
const passport = require("passport");
const {check} = require('express-validator');

const {
    createUser,
    logInUser,
    getUserByJWT,
    getAllUser,
    setAdminStatus,
    createUserByTelegram
} = require('../controllers/Users');


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

// @route   POST api/users/telegram
// @desc    Register user by telegram
// @access  Public
router.post('/telegram',
    [
        check("first_name", "first_name is required")
            .not()
            .isEmpty(),
        check("id", "id  is required")
            .not()
            .isEmpty(),
        check("last_name", "last_name is required")
            .not()
            .isEmpty(),
        check("username", "username is required")
            .not()
            .isEmpty()
    ],
    createUserByTelegram
);


// @route   POST api/users/login
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

// @route   GET api/users
// @desc    decoding jwt user's token
// @access  Public
router.get('/',
    passport.authenticate("jwt-local", {session: false}),
    getUserByJWT
);


// @route   GET api/users/all
// @desc    Get all user for admin
// @access  Private
router.get('/all',
    passport.authenticate("jwt-admin", {session: false}),
    getAllUser
);


// @route   POST api/users/setstatus
// @desc    set status admin for user
// @access  Private
router.post('/setstatus',
    passport.authenticate("jwt-admin", {session: false}),
    setAdminStatus
);

module.exports = router;