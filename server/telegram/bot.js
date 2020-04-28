const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_MODE === "FINAL" ? '882497789:AAEa7ryfVtVr0LBFmejHR_E9maTB9HLMYWs' : '1279631755:AAE3vWxpACd0nRHSdGnUGsIs0vcVQyh5XqI';//1279631755:AAE3vWxpACd0nRHSdGnUGsIs0vcVQyh5XqI
const bot = new TelegramBot(token, {polling: true});
const User = require('../models/Users');
const _ = require('lodash');

bot.onText(/\/start/, async (msg) => {
    const {from: {id, first_name, last_name, username}} = msg;
    const isOldUser = await User.findOne({telegramId: id});
    if (_.isNull(isOldUser)) {
        const user = new User({
            login:username,
            firstName:first_name,
            lastName:last_name,
            telegramId: id
        });
        await user.save();
    }
    await bot.sendMessage(id, ("Welcome "+first_name));
});

bot.on('message', (msg) => {
    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
    }
});

module.exports = bot;