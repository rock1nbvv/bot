const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    days: [
        {
            date: {
                type: Number,
                required: true
            },
            event: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = Schedule = mongoose.model("schedules", ScheduleSchema, "schedules");