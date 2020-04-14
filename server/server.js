const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require('body-parser');
const passport = require('passport');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_MODE === "FINAL" ? '882497789:AAEa7ryfVtVr0LBFmejHR_E9maTB9HLMYWs' : '1279631755:AAE3vWxpACd0nRHSdGnUGsIs0vcVQyh5XqI';
const bot = new TelegramBot(token, {polling: true});


console.log(process.env.TELEGRAM_MODE);
console.log(token);

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
        })
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

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.get("*", (req, res) => {

    console.log(path.resolve(__dirname, "client/build/index.html"));
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server has been started')
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