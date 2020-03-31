const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

const ScheduleSchema = new Schema({
    groupsId: {
        type: Schema.Types.ObjectId,
        ref: "groups"
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    }
});

ScheduleSchema.plugin(mongoosePaginate);

module.exports = Schedule = mongoose.model("schedules", ScheduleSchema, "schedules");