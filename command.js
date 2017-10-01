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
const regex = /^\/.*/g;

module.exports.elaborateCommand = (event, context, callback) => {

  let message = event.body.message;
  console.log(message);

  if(message.from.username == admin){

    if(regex.test(message.text)){

      switch (message.text) {
        case "/temp":
          module.exports.getTemperature(event, context, callback)
          break;
        case "/hum":
          module.exports.getTemperature(event, context, callback)
          break;
        case "/buzz":
          module.exports.ring(event, context, callback)
          break;
        case "/photo":
          module.exports.shootPhoto(event, context, callback)
          break;
        case "/alarm on":
          module.exports.enableAlarm(event, context, callback)
          break;
        case "/alarm off":
          module.exports.disableAlarm(event, context, callback)
          break;
        default:
          bot.sendMessage({
            chat_id: notificationChat,
            text: MSG_NOT_A_COMMAND
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

    }else{

      bot.sendMessage({
        chat_id: notificationChat,
        text: process.env.MSG_COMMAND_NOT_FOUND
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

  }else{
    console.error("Message from "+message.from.username+" not from admin");
    callback(null, {
      statusCode: 401
    });
  }

};

module.exports.getTemperature = (event, context, callback) => {
  iotdata.getThingShadow({
    thingName: "DHT11"
  }, function(err, data){
    if(err){
      console.error("Error publishing message");
      callback(err);
    }else{
      console.log(data);

      bot.sendMessage({
        chat_id: notificationChat,
        text: data.temperature+"C"
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
  });
}

module.exports.getHumidity = (event, context, callback) => {
  iotdata.getThingShadow({
    thingName: "DHT11"
  }, function(err, data){
    if(err){
      console.error("Error getting shadow");
      callback(err);
    }else{
      console.log(data);

      bot.sendMessage({
        chat_id: notificationChat,
        text: data.humidity+"%"
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
  });
}

module.exports.ring = (event, context, callback) => {
  iotdata.publish({
    topic: 'ring',
    payload: JSON.stringify({
      timeout: 2000
    }),
    qos: 0
  }, function(err, data){
    if(err){
      console.error("Error publishing message");
      callback(err);
    }else{
      console.log(data);

      bot.sendMessage({
        chat_id: notificationChat,
        text: process.env.MSG_RINGING
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
  });
}

module.exports.shootPhoto = (event, context, callback) => {
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
}

module.exports.enableAlarm = (event, context, callback) => {
  iotdata.updateThingShadow({
    thingName: 'Motion',
    payload: JSON.stringify({
      state: {
        desired: {
          enable: 1
        }
      }
    }),
  }, function(err, data){
    if(err){
      console.error("Error updating shadow");
      callback(err);
    }else{
      console.log(data);

      bot.sendMessage({
        chat_id: notificationChat,
        text: process.env.MSG_ALARM_ENABLED
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
  });
}

module.exports.disableAlarm = (event, context, callback) => {
  iotdata.updateThingShadow({
    thingName: 'Motion',
    payload: JSON.stringify({
      state: {
        desired: {
          enable: 0
        }
      }
    }),
  }, function(err, data){
    if(err){
      console.error("Error updating shadow");
      callback(err);
    }else{
      console.log(data);

      bot.sendMessage({
        chat_id: notificationChat,
        text: process.env.MSG_ALARM_DISBLED
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
  });
}
