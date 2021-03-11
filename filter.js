const bannedWordList = new Set(["test", "apple", "ban"]);

exports.isBadMessage = function (message) {
  const words = message.split(" ")

  for (const word of words) {
    if (bannedWordList.has(word) || kmp_search_word(word)) {
      return true;
    }
  }

  return false;
}
