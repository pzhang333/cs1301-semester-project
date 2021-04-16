const fs = require('fs');
const doubleMetaphone = require('double-metaphone')

class Filter {
  constructor() {
    this.banned = new Set()
    this.phonetic = new Set()
    this.valid = new Set()
    this.transform = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ý': 'y',
      'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
      'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
      'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
      'ã': 'a', 'ñ': 'n', 'õ': 'o', 'ç': 'c',
      '©': 'c', '®': 'r', '$': 's', "@": 'a', '!': 'i',
      '&': 'a', '3': 'e', '1': 'l', '4': 'a', '7': 't', '0': 'o'
    }

    // loading banned word list first
    const bannedWords = fs.readFileSync('./banned.txt', 'utf-8').split('\n')
    for (const word of bannedWords) {
      // adding to banned word list
      this.banned.add(word)

      // double metaphone returns 2 phonetic translations
      const phonetic = doubleMetaphone(word)
      this.phonetic.add(phonetic[0])
      this.phonetic.add(phonetic[1])
    }

    // loading valid dictionary next
    const words = fs.readFileSync('./dictionary.txt', 'utf-8').split('\n')
    for (const word of words) {
      if (this.banned.has(word) || this.banned.has(word.toLocaleLowerCase())) {
        // in banned list so we should ignore this word
        continue
      }

      const phonetic = doubleMetaphone(word.toLocaleLowerCase())
      if (this.phonetic.has(phonetic[0]) || this.phonetic.has(phonetic[1])) {
        // in banned phonetic list so we should ignore this word
        continue
      }

      this.valid.add(word.toLocaleLowerCase())
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
      const lowercaseWord = word.toLocaleLowerCase()
      if (!(this.valid.has(lowercaseWord))) {
        unknownWords.add(lowercaseWord)
      }
    }

    const canonicalWords = new Set()
    // converting words to canonical form
    for (const word of unknownWords) {
      canonicalWords.add(this.getCanonical(word))
    }

    // checking for word in banned words and in phonetic filter
    for (const word of canonicalWords) {
      if (this.banned.has(word)) {
        return true
      }
      const phonetic = doubleMetaphone(word)
      if (this.phonetic.has(phonetic[0]) || this.phonetic.has(phonetic[1])) {
        return true
      }
    }

    if (userRank < 0.5) {
      return true
    } else {
      return false
    }
  }
}
  
module.exports = {
  Filter: Filter
}
