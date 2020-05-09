const {validationResult} = require("express-validator");
const _ = require("lodash");
const GroupsModel = require('../models/Groups');
const EventModel = require("../models/Event");
const mongoose = require("mongoose");
const bot = require("../telegram/bot");

exports.createEvent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name, description, groupId} = req.body;

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({
                message: `Group Id is not valid ${groupId}`
            });
        }
        let group = await GroupsModel.findById(groupId)
            .populate("students");
        if (!group) {
            return res.status(400).json({
                message: `Group with id ${groupId} is not found`
            });
        }
        await (new EventModel({name, description, groupId})).save();

        await Promise.all(group.students.map(async s => {
            if (_.isString(s.telegramId) && s.telegramId.length > 0) {
                return await bot.sendMessage(s.telegramId, (name + "\n\n" + description));
            }
        }));

        return res.status(200).json({
            message: "Event successfully added"
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};