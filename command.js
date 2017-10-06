'use strict';

/**
 * Received command from Telegram
 */

const telegram = require('telegram-bot-api');
const AWS = require('aws-sdk');
const iotdata = new AWS.IotData({endpoint: process.env.IOT_HOST});
const notificationChat = process.env.NOTIFICATION_CHAT;
const admin = process.env.ADMIN_USERNAME;
const bot = new telegram({
  token: process.env.API_TOKEN
});

function sendMessage(msg, callback){
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

function updateThingShadow(thingName, data, callback){
  iotdata.updateThingShadow({
    thingName: thingName,
    payload: JSON.stringify({
      state: {
        desired: data
      }
    }),
  }, function(err, data){
    if(err){
      console.error("Error updating shadow");
      callback(err);
    }else{
      console.log(data);
      sendMessage(process.env.MSG_ACK, callback);
    }
  });
}

function publishOnTopic(topic, message, callback){
  iotdata.publish({
    topic: topic,
    payload: message,
    qos: 0
  }, function(err, data){
    if(err){
      console.error("Error publishing message");
      callback(err);
    }else{
      console.log(data);
      sendMessage(process.env.MSG_ACK, callback);
    }
  });
}

function getThingShadow(thingName, callback){
  iotdata.getThingShadow({
    thingName: "DHT11"
  }, function(err, data){
    if(err){
      console.error("Error publishing message");
      callback(err);
    }else{
      console.log(data);
      callback(null, data);
    }
  });
}

module.exports.elaborateCommand = (event, context, callback) => {

  let message = event.body.message;
  let regex = /^\/.*/g;
  console.log(message);

  if(message.from.username == admin){

    if(regex.test(message.text) == true){

      switch (message.text) {
        case "/start":
          sendMessage(process.env.MSG_WELCOME, callback);
          break;
        case "/temp":
          getThingShadow("DHT11", function(err, data){
            if(err){
              callback(err);
            }else{
              sendMessage(data.temperature+"C°", callback);
            }
          })
          break;
        case "/hum":
          getThingShadow("DHT11", function(err, data){
            if(err){
              callback(err);
            }else{
              sendMessage(data.humidity+"%", callback);
            }
          })
          break;
        case "/buzz":
          publishOnTopic('ring', JSON.stringify({
            timeout: 2000
          }, callback))
          break;
        case "/photo":
          publishOnTopic('camera-shoot-photo', "", callback)
          break;
        case "/alarm on":
          updateThingShadow('Motion', {
            enable: 1
          }, callback)
          break;
        case "/alarm off":
          updateThingShadow('Motion', {
            enable: 0
          }, callback)
          break;
        case "/led on":
          updateThingShadow('Led', {
            active: 1
          }, callback)
          break;
        case "/led off":
          updateThingShadow('Led', {
            active: 0
          }, callback)
          break;
        default:
          sendMessage(process.env.MSG_COMMAND_NOT_FOUND, callback);
      }

    }else{
      sendMessage(process.env.MSG_NOT_A_COMMAND, callback);
    }

  }else{
    console.error("Message from "+message.from.username+" not from admin");
    callback(null, {
      statusCode: 401
    });
  }

};
