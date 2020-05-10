const {validationResult} = require("express-validator");
const _ = require("lodash");
const GroupsModel = require('../models/Groups');
const EventModel = require("../models/Event");
const mongoose = require("mongoose");
const bot = require("../telegram/bot");
const schedule = require('node-schedule');

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
        await (new EventModel({name, description, groupId, status: true})).save();

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

exports.createScheduledEvent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        let {name, description, groupId, date} = req.body;

        date = new Date(date);

        if (_.isNaN(date.getDate())) {
            return res.status(400).json({
                message: 'Date is not valid'
            });
        }

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
        let newEv = await (new EventModel({name, description, date: date.toJSON(), groupId})).save();

        schedule.scheduleJob(date, async () => {
            await EventModel.findByIdAndUpdate(newEv._id, {$set: {status: true}});
            await Promise.all(group.students.map(async s => {
                if (_.isString(s.telegramId) && s.telegramId.length > 0) {
                    return await bot.sendMessage(s.telegramId, (name + "\n\n" + description));
                }
            }));
        });

        return res.status(200).json({
            message: "Event successfully added"
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};