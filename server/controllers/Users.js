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
            isAdmin: newUser.isAdmin
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
                    isAdmin: user.isAdmin
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