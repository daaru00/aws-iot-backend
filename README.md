## AWS IoT Backend Example

Example of usage of AwS Lambda to administrate remote IoT device using Telegram bot using [AWS IoT Example](https://github.com/daaru00/aws-iot-example).

### Getting Start

This code use [Serverless](https://serverless.com/) framework refere to official [documentation](https://serverless.com/framework/docs/providers/aws/).

Install the Serverless cli
```bash
npm install -g serverless
```

Install project dependencies
```bash
npm install
```

### Env file

Create e new `.env` file based on `.env.dist`in the project root as the follow

Add profile name used in [AWS cli](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html),
you can find the configurations in `~/.aws/credentials` file.
```
export AWS_PROFILE=
export AWS_REGION=
```

Configure Telegram Bot creating and retrieve a token asking to [BotFather](https://telegram.me/BotFather).
Set the admin username and notification chatId to receive notification and send command.
```
export API_TOKEN=
export ADMIN_USERNAME=
export NOTIFICATION_CHAT=
```

Add some environment configurations like an S3 bucket name used to send image and the IoT hostname.
```
export PHOTO_BUCKET=
export IOT_HOST=
```

Set message string
```
export MSG_MOTION_ACTIVATED=Motion detected
export MSG_MOTION_DEACTIVATED=Motion alarm released
export MSG_NOT_A_COMMAND=Invalid Command
export MSG_COMMAND_NOT_FOUND=Command not found
export MSG_WELCOME=Welcome
export MSG_ACK=Ok
```

### Deploy

Use `deploy` make command to create the environment on AWS
```bash
make deploy
```

Once deployed set the Telegram Bot Webhook as the `telegramCommand` Lambda API Endpoint executing a simple HTTP request
```bash
curl https://api.telegram.org/<bot token>/setWebHook?url=<telegramCommand endpoint>
```

### Commands

Bot slash commands are declared in `command.js` file, the provide example contain

`/start`
Simply the welcome message

`/temp`
Get DHT11 temperature value

`/hum`
Get DHT11 humidity value

`/buzz`
Make buzzer ring

`/photo`
Take a photo using camera

`/alarm on`
Enable motion alarm

`/alarm off`
Disable motion alarm

`/led on`
Switch on led

`/led off`
Switch off led

### Debugging

You can read the remote Lambda log using make commands `log-motion-activated`, `log-motion-deactivated`, `log-command`, `log-photo`.
