const tmi = require('tmi.js'); // library for communicating with Twitch
require('dotenv').config(); // loading .env vars, needed for bot to connect to Twitch
const Filter = require('./filter.js').Filter; // loading our custom filter class

// log-in details
const options = {
  identity: {
    username: 'livestreamingbot',
    password: process.env.OAUTH
  },
  channels: [
    'livestreamingbot'
  ]
};

// creating bot
const bot = new tmi.client(options);

// creating filter
const filter = new Filter();

// creating handlers
function messageHandler(target, context, msg, self) {
  // ignore all messages coming from the bot itself
  if (self) {
    return;
  }

  const badMessage = filter.shouldRemove(msg);
  if (badMessage) {
    const messageUUID = context.id;
    bot.deletemessage(target, messageUUID)
    .then((_) => {
      console.log(`Removed message: ${msg}`)
    }).catch((err) => {
      console.log(err)
    });
  }
}

function connectedHandler(addr, port) {
  console.log(`Connected to ${addr} on port: ${port}`);
}

// registering handlers
bot.on('message', messageHandler);
bot.on('connected', connectedHandler);

// starting bot
bot.connect();
