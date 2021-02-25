
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

const banned = new Set(["fuck", "test", "trump"])

function basic_matching(word) {
  if (banned.has(word)) {
    return true;
  }
  return false;
}

function build_table_kmp(word) {
  let T = new Array(word.length + 1).fill(0);
  T[0] = -1;
  let pos = 1;
  let cnd = 0;
  while (pos < word.length) {
    if (word[pos] == word[cnd]) {
      T[pos] = T[cnd]
    } else {
      T[pos] = cnd
      while (cnd >= 0 && (word[pos] != word[cnd])) {
        cnd = T[cnd]
      }
    }
    pos += 1;
    cnd += 1;
  }
  T[pos] = cnd;
  return T;
}

function kmp_search_word(word) {
  let isBanned = false
  banned.forEach(function(bannedWord) {
    let j = 0
    let k = 0
    const T = build_table_kmp(bannedWord)
    let ret = []
    while (j < word.length) {
      if (bannedWord[k] == word[j]) {
        k += 1
        j += 1
        if (k == bannedWord.length) {
          isBanned = true
          break
        }
      } else {
        k = T[k]
        if (k < 0) {
        	j += 1
          k += 1
        }
      }
    }
  })
  return isBanned
}

function messageHandler(target, context, msg, self) {
    if (self) {
        return;
    }
    const message = msg.split(" ")
    let isBanned = false
    for (i=0; i< message.length; i++) {
        const word = message[i]
        if (kmp_search_word(word) || basic_matching(word)) {
            isBanned = true
            break
        }
    }

    if (isBanned) {
        bot.say(target, "Banned message sent.")
    } else {
        bot.say(target, "Message was fine!")
    }
}

function connectedHandler(addr, port) {
    console.log(`Connected to ${addr} on port: ${port}`);
}

bot.on('message', messageHandler);
bot.on('connected', connectedHandler);

bot.connect();
