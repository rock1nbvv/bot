const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_MODE === "FINAL" ? '882497789:AAEa7ryfVtVr0LBFmejHR_E9maTB9HLMYWs' : '1279631755:AAE3vWxpACd0nRHSdGnUGsIs0vcVQyh5XqI';//1279631755:AAE3vWxpACd0nRHSdGnUGsIs0vcVQyh5XqI
const bot = new TelegramBot(token, {polling: true});
const User = require('../models/Users');
const GroupsModel = require('../models/Groups');
const _ = require('lodash');


const labels = [
    {
        field: "firstName",
        label: "First name"
    },
    {
        field: "lastName",
        label: "Last name"
    },
    {
        field: "middleName",
        label: "Middle name"
    },
    {
        field: "login",
        label: "Login"
    },
];


const eventPool = [];


bot.onText(/\/start/, async (msg) => {
    resetEventPool();
    const {from: {id, first_name, last_name, username}} = msg;
    let isOldUser = await User.findOne({telegramId: id});
    if (_.isNull(isOldUser)) {
        const user = new User({
            login: username,
            firstName: first_name,
            lastName: last_name,
            telegramId: id
        });
        isOldUser = await user.save();
    }

    let groups = await GroupsModel.find();

    let inline_keyboard = groups.map(g => {
        return [{
            text: g.name,
            callback_data: g._id
        }]
    });

    let options = {
        reply_markup: {
            inline_keyboard
        }
    };

    await bot.sendMessage(id, ("Welcome " + first_name + " select group"), options);


    let index = 2;
    let reason = "callback_query";
    let event2 = bot.once("callback_query", async (callbackQuery) => {
        const {data} = callbackQuery;
        const {_id} = isOldUser;

        const group = await GroupsModel.find({students: _id});
        await Promise.all(group.map(async g => {
            return await GroupsModel.findByIdAndUpdate(g._id, {$pull:{students: _id}});
        }));

        await GroupsModel.findByIdAndUpdate(data, {$push: {students: _id}});

        let userString = "Successfully added to group.\n\nYour data:\n";

        labels.forEach(l => {
            userString += `${l.label}: ${isOldUser[`${l.field}`]}\n`;
        });

        userString += "\n Please check and edit your data if needed /edit";

        await bot.sendMessage(id, userString);

        removeFromEventPool(index);
    });
    addToEventPool(index, reason, event2);
});

bot.onText(/\/edit/, async (msg) => {
    resetEventPool();

    const {from: {id}} = msg;
    const user = await User.findOne({telegramId: id});
    let userString = "Please, select field which you want to edit\n\nYour data:\n";

    labels.forEach(l => {
        userString += `${l.label}: ${user[`${l.field}`]}\n`;
    });

    let inline_keyboard = labels.map(g => {
        return [{
            text: g.label,
            callback_data: g.field
        }]
    });

    let options = {
        reply_markup: {
            inline_keyboard
        }
    };

    await bot.sendMessage(id, userString, options);

    let index = 1;
    let reason = "callback_query";


    let event1 = bot.once(reason, async (callbackQuery) => {
        const {data} = callbackQuery;
        const {_id} = user;
        await bot.sendMessage(id, "Enter your data");

        let indexIn = 3;
        let reasonIn = "message";
        let event3 = bot.once('message', async (msg) => {
            const {text} = msg;
            if (_.isString(text) && text.length > 0 && text[0] !== "/") {
                if (data === "login") {
                    const isUser = await User.findOne({login: text});
                    if (isUser) {
                        return await bot.sendMessage(id, "Login is used");
                    }
                }
                const query = {$set: {}};
                query.$set[`${data}`] = text;
                User.findByIdAndUpdate(_id, query).then(async () => {
                    await bot.sendMessage(id, "Success change data");
                });
            }
            removeFromEventPool(indexIn);
        });
        addToEventPool(indexIn, reasonIn, event3);


        removeFromEventPool(index);
    });
    addToEventPool(index, reason, event1);
});


const resetEventPool = () => {
    if (eventPool.length > 0) {
        eventPool.forEach(e => {
            bot.removeListener(e.reason, e.event);
        });
        eventPool.splice(0, eventPool.length);
    }
};

const addToEventPool = (index, reason, event) => {
    eventPool.push({index, reason, event});
};

const removeFromEventPool = index => {
    let indexEventPool = _.findIndex(eventPool, (o) => o.index === index);
    bot.removeListener(eventPool[indexEventPool].reason, eventPool[indexEventPool].event);
    eventPool.splice(indexEventPool, 1);
};


module.exports = bot;