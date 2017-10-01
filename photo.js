'use strict';

/**
 * Send Photo to Telegram
 */

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const iotdata = new AWS.IotData({endpoint: process.env.IOT_HOST});

const fs = require('fs');
const telegram = require('telegram-bot-api');
const notificationChat = process.env.NOTIFICATION_CHAT;
const bot = new telegram({
  token: process.env.API_TOKEN
});

module.exports.handler = (event, context, callback) => {
  var data = event.Records[0].s3;
  console.log(data);

  var bucket = data.bucket.name;
  var key = data.object.key;
  var tmpFile = '/tmp/'+key;

  var file = fs.createWriteStream(tmpFile);
  s3.getObject({
    Bucket: bucket,
    Key: key
  }).on('error', function(err) {
    console.error("Error downloading file from S3");
    callback(err);
  }).on('httpData', function(chunk) {
    file.write(chunk);
  }).on('httpDone', function() {
    file.end();

    console.log("downloaded file to" + tmpFile);
    bot.sendPhoto({
      chat_id: notificationChat,
      photo: tmpFile
    }).then(function(data) {
      console.log(data);

      callback(null, data);
    }).catch(function(err) {
      console.error("Error sending file to telegram");
      callback(err);
    });

  }).send();

};
