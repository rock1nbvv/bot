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
    createUserByTelegram,
    editUser,
    connectTelegramToUser,
    disconnectTelegramToUser,
    addUserToGroup,
    deleteUserFromGroup
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

// @route   PUT api/users
// @desc    Register user
// @access  Public
router.put('/', passport.authenticate("jwt-local", {session: false}), editUser);

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

// @route   PUT api/users/telegram
// @desc    Connect telegram to user
// @access  Public
router.put('/telegram',
    [
        passport.authenticate("jwt-local", {session: false}),
        check("id", "id  is required")
            .not()
            .isEmpty()
    ],
    connectTelegramToUser
);

// @route   DELETE api/users/telegram
// @desc    Connect telegram to user
// @access  Public
router.delete('/telegram',
    passport.authenticate("jwt-local", {session: false}),
    disconnectTelegramToUser
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

// @route   PUT api/user/group
// @desc    Add user to group
// @access  Public
router.put('/group',
    [
        passport.authenticate("jwt-local", {session: false}),
        check("groupId", "Group id is required")
            .not()
            .isEmpty()
    ],
    addUserToGroup
);

// @route   DELETE api/users/group
// @desc    remove user from group
// @access  Public
router.delete('/group',
    [
        passport.authenticate("jwt-local", {session: false}),
    ],
    deleteUserFromGroup
);

module.exports = router;