const fs = require('fs');
const pf = require('./phonetic')

class Filter {
  constructor() {
    this.valid = new Set()
    this.banned = new Set()
    this.phonetic = new Set()

    const words = fs.readFileSync('./dictionary.txt', 'utf-8')
      .split('\n')
    for (const word of words) {
      this.valid.add(word)
      this.valid.add(word.toLowerCase())
    }

    const bannedWords = fs.readFileSync('./banned.txt', 'utf-8')
      .split('\n')
    for (const word of bannedWords) {
      this.banned.add(word)
      this.valid.delete(word)
      this.phonetic.add(pf.phonetic_filter(word))
    }
  }

  shouldRemove(message) {
    // const suspiciousWords = new Set()

    // for (const word of message.split(' ')) {
    //   if (!(this.valid.has(word) || this.valid.has(word.toLowerCase()))) {
    //     suspiciousWords.add(word)
    //   }
    // }

    // for (const word of suspiciousWords) {
    //   if (this.banned.has(word)) {
    //     return true
    //   }
    // }

    // return false


    for (const word of message.split(' ')) {
      if (this.phonetic.has(pf.phonetic_filter(word))) {
        return true;
      }
    }
    return false
  }
}
  
module.exports = {
  Filter: Filter
}
