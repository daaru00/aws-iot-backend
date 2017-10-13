'use strict';

/**
 * Received command from Telegram
 */

const iot = require('./lib/iot.js');
const telegram = require('./lib/telegram.js');

module.exports.handler = (event, context, callback) => {

  telegram.sendMessage(process.env.MSG_BUTTON_CLICKED, function(err, data){
    if(err){
      console.error("Error sending message");
      callback(err);
    }else{
      console.log(data);
      iot.publishOnTopic('camera-shoot-photo', '', function(err, data){
        if(err){
          console.error("Error publishing message");
          callback(err);
        }else{
          console.log(data);
          callback(null, data);
        }
      })
    }
  });

}
