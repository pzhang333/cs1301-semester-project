const fs = require('fs');
const doubleMetaphone = require('double-metaphone')

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

      // double metaphone returns 2 phonetic translations
      const phonetic = doubleMetaphone(word)
      this.phonetic.add(phonetic[0])
      this.phonetic.add(phonetic[1])
    }
  }

  getCanonical(word) {
    const canonicalWord = []
    for (const letter of word) {
      if (letter in this.transform) {
        canonicalWord.push(this.transform[letter])
      } else {
        canonicalWord.push(letter)
      }
    }
    return canonicalWord.join('')
  }

  shouldRemove(message, userRank) {
    const unknownWords = new Set()
    // if a word appears in the valid list, we no longer consider it
    for (const word of message.split(' ')) {
      if (!(this.valid.has(word) || this.valid.has(word.toLowerCase()))) {
        unknownWords.add(word.toLowerCase()) // we only work with lower case
      }
    }

    // for easy demo purposes, we have an empty valid word list
    for (const word of message.split(' ')) {
      unknownWords.add(word.toLowerCase()) // we only work with lower case
    }

    const canonicalWords = new Set()
    // converting words to canonical form
    for (const word of unknownWords) {
      canonicalWords.add(this.getCanonical(word))
    }

    // checking for word in banned words and in phonetic filter
    for (const word of canonicalWords) {
      console.log(word)
      if (this.banned.has(word)) {
        return true
      }
      const phonetic = doubleMetaphone(word)
      if (this.phonetic.has(phonetic[0]) || this.phonetic.has(phonetic[1])) {
        return true
      }
    }

    if (userRank <= 0.5) {
      return true
    } else {
      return false
    }
  }
}
  
module.exports = {
  Filter: Filter
}
