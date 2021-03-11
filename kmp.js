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
bannedWordList.forEach(function(bannedWord) {
    let j = 0
    let k = 0
    const T = build_table_kmp(bannedWord)
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
