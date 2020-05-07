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

// {
//     event: ObjectEvent,
//     stringEvent: String,
//     id: Random int
// }
bot.onText(/\/start/, async (msg) => {

    const {from: {id, first_name, last_name, username}} = msg;
    const isOldUser = await User.findOne({telegramId: id});
    if (_.isNull(isOldUser)) {
        const user = new User({
            login: username,
            firstName: first_name,
            lastName: last_name,
            telegramId: id
        });
        await user.save();
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


    let event1 = bot.once("callback_query", async (callbackQuery) => {
        const {data} = callbackQuery;
        const {_id} = isOldUser;


        let isUser = await GroupsModel.find({students: _id});

        if (isUser.length > 0) {
            await Promise.all(isUser.map(async g => {
                return await GroupsModel.findByIdAndUpdate(
                    {_id: g._id},
                    {pull: {students: _id}}
                )
            }));
        }

        await GroupsModel.findByIdAndUpdate(
            {_id: data},
            {push: {students: _id}}
        );


        let userString = "Successfully added to group.\n\nYour data:\n";

        labels.forEach(l => {
            userString += `${l.label}: ${isOldUser[`${l.field}`]}\n`;
        });

        userString += "\n Please check and edit your data if needed /edit";

        await bot.sendMessage(id, userString);
    });

    listEvent.push(event1);
});

bot.onText(/\/edit/, async (msg) => {

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

    bot.once("callback_query", async (callbackQuery) => {
        const {data} = callbackQuery;
        const {_id} = user;
        await bot.sendMessage(id, "Enter your data");
        bot.once('message', async (msg) => {
            const {text} = msg;
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
        });
    });
});


module.exports = bot;