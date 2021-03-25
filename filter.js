const fs = require('fs');
const pf = require('./phonetic')

class Filter {
  constructor() {
    this.valid = new Set()
    this.banned = new Set()
    this.phonetic = new Set()
    this.transform = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ý': 'y',
      'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
      'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
      'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
      'ã': 'a', 'ñ': 'n', 'õ': 'o', 'ç': 'c',
      '©': 'c', '®': 'r', '$': 's', "@": 'a', '!': 'i',
      '&': 'a', '3': 'e', '1': 'l', '4': 'a', '7': 't', '0': 'o'
    }

    const words = fs.readFileSync('./dictionary.txt', 'utf-8')
      .split('\n')
    for (const word of words) {
      this.valid.add(word)
      this.valid.add(word.toLowerCase())
    }

    const bannedWords = fs.readFileSync('./banned.txt', 'utf-8')
      .split('\n')
    for (const word of bannedWords) {
      this.valid.delete(word)
      this.banned.add(word)
      this.phonetic.add(pf.phonetic_filter(word))
    }
  }

  getCanonical(word) {
    const canonicalWord = []
    for (const letter of word) {
      if (letter in transform) {
        canonicalWord.push(this.transform[letter])
      } else {
        canonicalWord.push(letter)
      }
    }
    return canonicalWord.join('')
  }

  shouldRemove(message) {
    const unknownWords = new Set()

    // if a word appears in the valid list, we no longer consider it
    for (const word of message.split(' ')) {
      if (!(this.valid.has(word) || this.valid.has(word.toLowerCase()))) {
        unknownWords.add(word.toLowerCase()) // we only work with lower case
      }
    }

    // converting words to canonical form
    for (const word of unknownWords) {
      unknownWords.delete(word)
      unknownWords.add(this.getCanonical(word))
    }

    // checking for word in banned words and in phonetic filter
    for (const word of unknownWords) {
      if (this.banned.has(word)) {
        return true
      }
      if (this.phonetic.has(pf.phonetic_filter(word))) {
        return true
      }
    }

    return false
  }
}
  
module.exports = {
  Filter: Filter
}
