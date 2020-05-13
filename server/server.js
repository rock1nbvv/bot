const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const EventModel = require('./models/Event');
const bot = require("./telegram/bot");
const _ = require("lodash");
const schedule = require('node-schedule');
const cors = require('cors');
require("./telegram/bot");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb+srv://admin:admin@cluster0-9rlxe.mongodb.net/test1?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(async () => {
    app.use(passport.initialize());
    require("./passport")(passport);
    let opened_evs = await EventModel.find({status: false})
        .populate({
            path: "groupId",
            populate: {
                path: "students"
            }
        });
    let now = new Date();
    await Promise.all(opened_evs.map(async e => {
        const {date, _id, name, description, groupId: {students}} = e;
        const d = new Date(date);
        if (d < now) {
            await EventModel.findByIdAndUpdate(_id, {$set: {status: true}});
            for (let i = 0; i < students.length; i++) {
                await bot.sendMessage(students[i].telegramId, (name + "\n\n" + description));
            }
        } else {
            schedule.scheduleJob(d,  () => {
                Promise.all(students.map(async s => {
                    if (_.isString(s.telegramId) && s.telegramId.length > 0) {
                        return await bot.sendMessage(s.telegramId, (name + "\n\n" + description));
                    }
                })).then(async res=>{
                    await EventModel.findByIdAndUpdate(_id, {$set: {status: true}});
                });
            });
        }
    }))
}).catch(err => {
    console.log("Error connect to database!");
    process.exit(1);
});


app.use("/api/user", require('./routes/Users'));
app.use("/api/groups", require('./routes/Groups'));
app.use("/api/event", require('./routes/Event'));

app.use(express.static("../client/build"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "client/build/index.html"));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server has been started');
});

