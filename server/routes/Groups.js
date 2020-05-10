const express = require("express");
const router = express.Router();
const passport = require("passport");
const {check} = require('express-validator');

const {createGroup, getAllGroups, editGroup, deleteGroup, getGroupByUser, getGroupList} = require('../controllers/Groups');


// @route   POST api/groups
// @desc    Create a new group
// @access  Public
router.post('/',
    [
        passport.authenticate("jwt-admin", {session: false}),
        check("name", "Name is required")
            .not()
            .isEmpty(),
    ],
    createGroup
);


// @route   GET api/groups/all
// @desc    get all groups
// @access  Public
router.get('/all',
    passport.authenticate("jwt-admin", {session: false}),
    getAllGroups
);

// @route   PUT api/groups
// @desc    edit group
// @access  Public
router.put('/', [
        passport.authenticate("jwt-admin", {session: false}),
        check("groupId", "groupId is required")
            .not()
            .isEmpty(),
        check("name", "Name is required")
            .not()
            .isEmpty(),
    ],
    editGroup);

// @route   DELETE api/groups/:id
// @desc    edit group
// @access  Public
router.delete('/', passport.authenticate("jwt-admin", {session: false}), deleteGroup);

router.get('/user', passport.authenticate("jwt-local", {session: false}), getGroupByUser);

router.get('/list', passport.authenticate("jwt-local", {session: false}), getGroupList);

module.exports = router;