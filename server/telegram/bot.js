const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_MODE === "FINAL" ? '882497789:AAEa7ryfVtVr0LBFmejHR_E9maTB9HLMYWs' : '1279631755:AAE3vWxpACd0nRHSdGnUGsIs0vcVQyh5XqI';//1279631755:AAE3vWxpACd0nRHSdGnUGsIs0vcVQyh5XqI
exports.bot= new TelegramBot(token, {polling: true});