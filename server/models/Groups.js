const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const GroupsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "users"
        }
    ]

});
GroupsSchema.plugin(mongoosePaginate);

module.exports = Groups = mongoose.model("groups", GroupsSchema, "groups");