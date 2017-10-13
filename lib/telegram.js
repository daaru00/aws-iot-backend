const telegram = require('telegram-bot-api');
const notificationChat = process.env.NOTIFICATION_CHAT;
const admin = process.env.ADMIN_USERNAME;
const bot = new telegram({
  token: process.env.API_TOKEN
});

module.exports.sendMessage = function(msg, callback){
  bot.sendMessage({
    chat_id: notificationChat,
    text: msg
  }).then(function(data){
    console.log(data);
    callback(null, {
      statusCode: 200
    });
  }).catch(function(err){
    callback(null, {
      statusCode: 500
    });
  });
}
