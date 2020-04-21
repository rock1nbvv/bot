const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-paginate-v2');

const UsersSchema = new Schema({
    password: {
        type: String
    },
    login: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    middleName: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    telegramId: {
        type: String
    },
    groups: {
        type: Schema.Types.ObjectId,
        ref: "groups"
    }
});

UsersSchema.plugin(mongoosePaginate);

UsersSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = User = mongoose.model("users", UsersSchema, "users");