const tmi = require('tmi.js');

require('dotenv').config()

const options = {
    identity: {
        username: 'livestreamingbot',
        password: process.env.OAUTH
    },
    channels: [
        'livestreamingbot'
    ]
};

const bot = new tmi.client(options);

function messageHandler(target, context, msg, self) {
    if (self) {
        return;
    }

    bot.say(target, 'Hello World!')
}

function connectedHandler(addr, port) {
    console.log(`Connected to ${addr} on port: ${port}`);
}

bot.on('message', messageHandler);
bot.on('connected', connectedHandler);

bot.connect();
