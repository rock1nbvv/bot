const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const EventSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    groupId:{
        type: Schema.Types.ObjectId,
        ref: "groups"
    },
    date: {
        type: Date,
        default: Date.now
    }
});
EventSchema.plugin(mongoosePaginate);

module.exports = Event = mongoose.model("events", EventSchema, "events");