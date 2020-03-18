const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UsersModel = require('./models/Users');
const mongoose = require('mongoose');
const lodash = require('lodash');

module.exports = async passport => {
    const optsJWT = {};
    optsJWT.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    optsJWT.secretOrKey = "rock1nbvv";

    passport.use("jwt-local", new JwtStrategy(optsJWT, async (jwt_payload, done) => {
        try {
            const {_id} = jwt_payload.date;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return done(null, false);
            }
            const oldUser = await UsersModel.findById();
            if (!lodash.isNull(oldUser)) {
                return done(null, oldUser);
            }
            return done(null, false);
        } catch (e) {
            return done(e, false, e.message);
        }
    }))
};
