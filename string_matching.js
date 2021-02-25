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

function kmp_search_word(string) {
  let isBanned = false
  banned.forEach(function(word) {
    let j = 0
    let k = 0
    const T = build_table_kmp(word)
    let ret = []
    while (j < string.length) {
      if (word[k] == string[j]) {
        k += 1
        j += 1
        if (k == word.length) {
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

// console.log(kmp_search("hahafuckhaha"))