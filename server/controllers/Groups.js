const {validationResult} = require("express-validator");
const _ = require("lodash");
const GroupsModel = require('../models/Groups');
const mongoose = require("mongoose");

exports.createGroup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name} = req.body;

        let group = await GroupsModel.findOne({name});
        if (!_.isNull(group)) {
            return res.status(409).json({
                message: `Group ${name} already exists`
            });
        }

        await (new GroupsModel({name})).save();

        return res.status(200).json({
            message: "Group success created"
        });

    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        const {page = 1, limit = 9} = req.query;
        const group = await GroupsModel.paginate({}, {
            page,
            limit,
            populate: [{
                path: "students",
                select: "-password"
            }]

        });

        return res.status(200).json(group);
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};

exports.editGroup = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {groupId, name} = req.body;

        if (!name) {
            return res.status(400).json({
                message: `Name is required`
            });
        }

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({
                message: `Group Id is not valid ${groupId}`
            });
        }
        let group = await GroupsModel.findByIdAndUpdate(groupId, {
            $set: {name}
        }, {
            new: true
        });

        if (!group) {
            return res.status(400).json({
                message: `Group with id ${groupId} is not found`
            });
        }

        res.status(200).json(group);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const {groupId} = req.query;
        const group = await GroupsModel.findById(groupId);

        if (!group) {
            return res.status(400).json({
                message: `Group with id ${groupId} is not found.`
            });
        }

        await group.delete();
        res.status(200).json({
            message: `Group with id ${groupId} is successfully deleted from DB.`,
            deletedCategoryInfo: group
        });
    } catch (e) {
        res.status(500).json({
            message: "Server Error!"
        });
    }
};

exports.getGroupByUser = async (req, res) => {
    try {
        const {_id} = req.user;
        const group = await GroupsModel.findOne({students: _id});
        res.status(200).json(group);
    } catch (e) {
        res.status(500).json({
            message: "Server Error!"
        });
    }
};

exports.getGroupList = async (req, res) => {
    try {
        res.status(200).json(await GroupsModel.find({},{
            name:1,
            _id:1
        }));
    } catch (e) {
        res.status(500).json({
            message: "Server Error!"
        });
    }
};