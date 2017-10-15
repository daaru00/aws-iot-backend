const AWS = require('aws-sdk');
const iotdata = new AWS.IotData({endpoint: process.env.IOT_HOST});
const telegram = require('./telegram');

module.exports.updateThingShadow = function(thingName, data, callback){
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
      telegram.sendMessage(process.env.MSG_ACK, callback);
    }
  });
}

module.exports.publishOnTopic = function(topic, message, callback){
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
      telegram.sendMessage(process.env.MSG_ACK, callback);
    }
  });
}

module.exports.getThingShadow = function(thingName, callback){
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
