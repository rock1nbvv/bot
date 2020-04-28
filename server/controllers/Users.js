const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {validationResult} = require("express-validator");
const _ = require("lodash");
const Users = require('../models/Users');

exports.createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {password, login, firstName, lastName, middleName} = req.body;

        let isUser = await Users.findOne({login});
        if (!_.isNull(isUser)) {
            return res.status(400).json({message: `Login already exists"`});
        }

        const salt = await bcrypt.genSalt(10);
        const encoderPassword = await bcrypt.hash(password, salt);


        const newUser = await (new Users({login, password: encoderPassword, firstName, lastName, middleName})).save();

        const payload = {
            _id: newUser._id,
            login: newUser.login,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            middleName: newUser.middleName,
            isAdmin: newUser.isAdmin,
            telegramId: newUser.telegramId
        };

        jwt.sign({data: payload}, "rock1nbvv", {expiresIn: 36000}, (err, token) => {
            return res.json({
                success: true,
                token: "Bearer " + token
            });
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.createUserByTelegram = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        let {first_name, id, last_name, username} = req.body;

        let user = await Users.findOne({telegramId: id});

        if (_.isNull(user)) {

            const isLogin = await Users.findOne({login: username});
            if (!_.isNull(isLogin)) {
                username = username + id;
            }

            user = await (new Users({
                login: username,
                firstName: first_name,
                lastName: last_name,
                telegramId: id
            })).save();
        }

        const payload = {
            _id: user._id,
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            isAdmin: user.isAdmin,
            telegramId: user.telegramId
        };

        jwt.sign({data: payload}, "rock1nbvv", {expiresIn: 36000}, (err, token) => {
            return res.json({
                success: true,
                token: "Bearer " + token
            });
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }

};

exports.logInUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {login, password} = req.body;
        const user = await Users.findOne({login});
        if (_.isNull(user)) {
            return res.status(403).json({
                message: "Not Found User"
            });
        }

        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (!isMatch) {
                    res.status(403).json({
                        message: "Password incorrect"
                    });
                }


                const payload = {
                    _id: user._id,
                    login: user.login,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    middleName: user.middleName,
                    isAdmin: user.isAdmin,
                    telegramId: user.telegramId
                };

                jwt.sign({data: payload}, "rock1nbvv", {expiresIn: 36000}, (err, token) => {
                    return res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                });

            })
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getUserByJWT = async (req, res) => {
    try {
        await res.json(req.user);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const {page = 1, limit = 9} = req.query;
        const user = await Users.paginate({}, {
            page,
            limit,
            select: '-password'
        });

        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.setAdminStatus = async (req, res) => {
    try {
        const {status = false, idUser} = req.body;
        if (!mongoose.Types.ObjectId.isValid(idUser)) {
            return res.status(400).json({
                message: `Id user is not vali`
            });
        }

        await Users.findByIdAndUpdate(idUser, {$set: {isAdmin: status}});
        res.status(200).json({
            message: "Status change success"
        })
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.editUser = async (req, res) => {
    try {
        const {_id} = req.user;
        const editInfo = {};
        const allowField = ["password", "login", "firstName", "lastName", "middleName"];

        for (let key in req.body) {
            if (_.includes(allowField, key) & !_.isNull(req.body[`${key}`]) & req.body[`${key}`].length > 0) {
                editInfo[`${key}`] = req.body[`${key}`];
            }
        }


        const {password} = editInfo;
        if (!_.isNull(password) & !_.isUndefined(password)) {
            const salt = await bcrypt.genSalt(10);
            editInfo.password = await bcrypt.hash(password, salt);
        }


        const newData = await (await Users.findByIdAndUpdate(_id, {$set: editInfo}, {new: true})).save();

        const payload = {
            _id: newData._id,
            login: newData.login,
            firstName: newData.firstName,
            lastName: newData.lastName,
            middleName: newData.middleName,
            isAdmin: newData.isAdmin,
            telegramId: newData.telegramId,
        };

        jwt.sign({data: payload}, "rock1nbvv", {expiresIn: 36000}, (err, token) => {
            return res.json({
                success: true,
                token: "Bearer " + token
            });
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: e.message
        });
    }
};

exports.connectTelegramToUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {_id} = req.user;
        const {id: telegramId} = req.body;


        const existedUser = await Users.findOne({telegramId: telegramId});

        if (!_.isNull(existedUser)) {
            await Users.deleteOne({telegramId: telegramId});
        }

        const newData = await (await Users.findByIdAndUpdate(_id, {$set: {telegramId: telegramId}}, {new: true})).save();

        const payload = {
            _id: newData._id,
            login: newData.login,
            firstName: newData.firstName,
            lastName: newData.lastName,
            middleName: newData.middleName,
            isAdmin: newData.isAdmin,
            telegramId: newData.telegramId,
        };

        jwt.sign({data: payload}, "rock1nbvv", {expiresIn: 36000}, (err, token) => {
            return res.json({
                success: true,
                token: "Bearer " + token
            });
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.disconnectTelegramToUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {telegramId} = req.query;
        const {_id} = req.user;

        const oldUSer = await Users.findOne({telegramId: telegramId});

        if (_.isNull(oldUSer)) {
            return res.status(400).json({message: `Id Telegram not found"`});
        }

        const newData = await (await Users.findByIdAndUpdate(_id, {$set: {telegramId: ""}}, {new: true})).save();

        const payload = {
            _id: newData._id,
            login: newData.login,
            firstName: newData.firstName,
            lastName: newData.lastName,
            middleName: newData.middleName,
            isAdmin: newData.isAdmin,
            telegramId: newData.telegramId,
        };

        jwt.sign({data: payload}, "rock1nbvv", {expiresIn: 36000}, (err, token) => {
            return res.json({
                success: true,
                token: "Bearer " + token
            });
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};
