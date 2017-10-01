'use strict';

/**
 * Send alarm notification to Telegram
 */

const telegram = require('telegram-bot-api');
const AWS = require('aws-sdk');
const iotdata = new AWS.IotData({endpoint: process.env.IOT_HOST});

const notificationChat = process.env.NOTIFICATION_CHAT;
const bot = new telegram({
  token: process.env.API_TOKEN
});
let self = this;

module.exports.motionActivated = (event, context, callback) => {

  bot.sendMessage({
    chat_id: notificationChat,
    text: process.env.MSG_MOTION_ACTIVATED
  }).then(function(data){
    console.log(data);

    iotdata.publish({
      topic: 'camera-shoot-photo',
      payload: "",
      qos: 0
    }, function(err, data){
      if(err){
        console.error("Error publishing message");
        callback(err);
      }else{
        console.log(data);

        callback(null, data);
      }
    });

  }).catch(function(err){
    callback(err);
  });

};

module.exports.motionDectivated = (event, context, callback) => {

  bot.sendMessage({
    chat_id: notificationChat,
    text: process.env.MSG_MOTION_DEACTIVATED
  }).then(function(data){

    console.log(data);

    callback(null, data);
  }).catch(function(err){
    callback(err);
  });

};
