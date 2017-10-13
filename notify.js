'use strict';

/**
 * Send alarm notification to Telegram
 */

const iot = require('./lib/iot.js');
const telegram = require('./lib/telegram.js');

module.exports.motionActivated = (event, context, callback) => {

  telegram.sendMessage(process.env.MSG_MOTION_ACTIVATED, function(err, data){
    if(err){
      console.error("Error publishing message");
      callback(err);
    }else{
      console.log(data);

      iot.publishOnTopic('camera-shoot-photo', "", function(err, data){
        if(err){
          console.error("Error publishing message");
          callback(err);
        }else{

          iot.publishOnTopic('buzzer-ring', JSON.stringify({
            timeout: 2000
          }), function(err, data){
            if(err){
              console.error("Error publishing message");
              callback(err);
            }else{
              iot.updateThingShadow('Led', {
                active: 1
              }, callback)
            }
          })

        }
      })

    }
  });

};

module.exports.motionDectivated = (event, context, callback) => {

  iot.updateThingShadow('Led', {
    active: 0
  }, function(err, data){
    if(err){
      console.error("Error publishing message");
      callback(err);
    }else{
      telegram.sendMessage(process.env.MSG_MOTION_DEACTIVATED, callback)
    }
  })

};
