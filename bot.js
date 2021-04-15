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

let userRanking = {}
// creating handlers
function messageHandler(target, context, msg, self) {
  // ignore all messages coming from the bot itself
  if (self) {
    return;
  }
  const userID = context['user-id']
  let newUser = false
  if (!(userID in userRanking)) {
    newUser = true
    userRanking[userID] = {
      "goodMessageCount": 0, 
      "badMessageCount": 0, 
      "timestamp": parseInt(context['tmi-sent-ts'])
    }
  }
  // 0/0 in JS is NaN so for new users, have a rank of 0.
  const userRank = userRanking[userID]["goodMessageCount"]/(userRanking[userID]["goodMessageCount"] + userRanking[userID]["badMessageCount"]) || 0
  // time is stored in milliseconds
  const timeSinceLastMessage = (userRanking[userID]["timestamp"] - parseInt(context['tmi-sent-ts']))/1000
  const badMessage = filter.shouldRemove(msg, userRank);
  if (badMessage) {
    const messageUUID = context.id;
    bot.deletemessage(target, messageUUID)
    .then((_) => {
      console.log(`Removed message: ${msg}`)
    }).catch((err) => {
      console.log(err)
    });
    userRanking[userID]["badMessageCount"]++
    userRanking[userID]["timestamp"] = parseInt(context['tmi-sent-ts'])
  } else {
    if (timeSinceLastMessage >= 1 || newUser) {
      userRanking[userID]["goodMessageCount"]++
      userRanking[userID]["timestamp"] = parseInt(context['tmi-sent-ts'])
    }
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
