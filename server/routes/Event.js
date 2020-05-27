const express = require("express");
const router = express.Router();
const passport = require("passport");
const {check} = require('express-validator');

const {createEvent, createScheduledEvent, getAllEvents, getAllEventsByGroup} = require('../controllers/Event');


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

// @route   POST api/event/sch
// @desc    Create a new group
// @access  Public
router.post('/sch',
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
        check("date", "date is required")
            .not()
            .isEmpty(),
    ],
    createScheduledEvent
);

//@route   GET api/event/all
//@desc    Get all user for admin
//@access  Private
router.get('/all',
    passport.authenticate("jwt-admin", {session: false}),
    getAllEvents
);

//@route   GET api/event/group
//@desc    Get all user for admin
//@access  Private
router.get('/group',
    passport.authenticate("jwt-local", {session: false}),
    getAllEventsByGroup
);

module.exports = router;