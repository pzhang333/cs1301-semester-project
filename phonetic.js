
function phonetic_filter(query) {
    query = query.toLowerCase()
  
    // TODO should i use reset query here to make sure non alphanumerics are gone?
    letters = Array.from(query)
    
    // remove non alphanumeric characters
    letters = letters.filter((char) => {
        code = char.charCodeAt(0)
        if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
      return true
    })
  
    if (letters.length == 1) {
      return letters.join('') + "000"
    }
  
    toRemove =  new Set(['a','e','i','o','u','y','h','w']);
    firstLetter = letters[0]
    letters = letters.slice(1)
    letters = letters.filter((char) => {
      if (to_remove.has(char)) {
        return false
      }
      return true
    })
    
    if (letters.length == 0) {
      return firstLetter + "000"
    }
  
    toReplace = {
      'b': 1,
      'f': 1,
      'p': 1,
      'v': 1,
      'c': 2,
      'g': 2,
      'j': 2,
      'k': 2,
      'q': 2,
      's': 2,
      'x': 2,
      'z': 2,
      'd': 3,
      't': 3,
      'l': 4,
      'm': 5,
      'n': 5,
      'r': 6
    }
  
    if (firstLetter in toReplace) {
      firstLetter = toReplace[firstLetter]
    }
  
    for (i=0; i<letters.length; i++) {
      currLetter = letters[i]
      if (currLetter in toReplace) {
        letters[i] = toReplace[currLetter]
      }
    }
  
    // replace all adjacent same digits with one digit
    currDigit = letters[0]
    filteredLetters = [letters[0]]
    for (i=1; i<letters.length; i++) {
      if (currDigit == letters[i]) {
        continue
      }
      filteredLetters.push(letters[i])
      currDigit = letters[i]
    }
  
    if (firstLetter == filteredLetters[0]) {
      filteredLetters[0] = query[0]
    } else {
      filteredLetters.splice(0, 0, query[0])
    }
  
    firstLetter = filteredLetters[0]
    letters = filteredLetters.slice(1)
    letters = letters.filter((char) => {
      val = parseInt(char)
      if (isNaN(val)){
        return false
      }
      return true
    })
    letters = letters.slice(0,3)
    while (letters.length < 3) {
      letters.push(0)
    }
    letters.splice(0, 0, firstLetter)
  
    return letters.join('')
  }