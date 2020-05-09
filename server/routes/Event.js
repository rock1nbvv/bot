const express = require("express");
const router = express.Router();
const passport = require("passport");
const {check} = require('express-validator');

const {createEvent} = require('../controllers/Event');


// @route   POST api/event
// @desc    Create a new group
// @access  Public
router.post('/',
    [
        passport.authenticate("jwt-admin", {session: false}),
        check("name", "Name is required")
            .not()
            .isEmpty(),
        check("description", "description is required")
            .not()
            .isEmpty(),
        check("groupId", "groupId is required")
            .not()
            .isEmpty(),
    ],
    createEvent
);

module.exports = router;