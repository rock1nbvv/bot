const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require('body-parser');
const passport = require('passport');
const {bot} =require("./telegram/bot");
const app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


new Promise(async (resolve, reject) => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin@cluster0-9rlxe.mongodb.net/test1?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        resolve();
    } catch (e) {
        reject(e);
    }
}).then(res => {
    app.use(passport.initialize());
    require("./passport")(passport);
}).catch(err => {
    console.log("Error connect to database!");
    process.exit(1);
});


app.use("/api/user", require('./routes/Users'));
app.use("/api/groups", require('./routes/Groups'));

app.use(express.static("../client/build"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "client/build/index.html"));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server has been started');
});


bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup": {
            "keyboard": [["Sample text", "Second sample"], ["Keyboard"], ["I'm robot"]]
        }
    });
});

bot.on('message', (msg) => {
    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
    }
});