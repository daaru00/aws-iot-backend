'use strict';

/**
 * Received command from Telegram
 */

const iot = require('./lib/iot.js');
const telegram = require('./lib/telegram.js');
const admin = process.env.ADMIN_USERNAME;

module.exports.elaborateCommand = (event, context, callback) => {

  let message = event.body.message;
  if(message != undefined){
    let regex = /^\/.*/g;
    console.log(message);

    if(message.from.username == admin){

      if(regex.test(message.text) == true){

        switch (message.text) {
          case "/start":
            telegram.sendMessage(process.env.MSG_WELCOME, callback);
            break;
          case "/temp":
            iot.getThingShadow("DHT11", function(err, data){
              if(err){
                callback(err);
              }else{
                telegram.sendMessage(data.temperature+"C°", callback);
              }
            })
            break;
          case "/hum":
            iot.getThingShadow("DHT11", function(err, data){
              if(err){
                callback(err);
              }else{
                telegram.sendMessage(data.humidity+"%", callback);
              }
            })
            break;
          case "/modem":
            iot.getThingShadow("Modem", function(err, data){
              if(err){
                callback(err);
              }else{
                telegram.sendMessage("Download: "+data.download+"Mb/s \nUpload: "+data.upload+"Mb/s \nIP: "+data.publicIP, callback);
              }
            })
            break;
          case "/buzz":
            iot.publishOnTopic('buzzer-ring', JSON.stringify({
              timeout: 2000
            }),callback);
            break;
          case "/photo":
            iot.publishOnTopic('camera-shoot-photo', "", callback)
            break;
          case "/alarm on":
            iot.updateThingShadow('Motion', {
              enable: 1
            }, callback)
            break;
          case "/alarm off":
            iot.updateThingShadow('Motion', {
              enable: 0
            }, callback)
            break;
          case "/led on":
            iot.updateThingShadow('Led', {
              active: 1
            }, callback)
            break;
          case "/led off":
            iot.updateThingShadow('Led', {
              active: 0
            }, callback)
            break;
          default:
            telegram.sendMessage(process.env.MSG_COMMAND_NOT_FOUND, callback);
        }

      }else{
        telegram.sendMessage(process.env.MSG_NOT_A_COMMAND, callback);
      }

    }else{
      console.error("Message from "+message.from.username+" not from admin");
      callback(null, {
        statusCode: 401
      });
    }
  }else{
    callback("message is undefined");
  }

};
