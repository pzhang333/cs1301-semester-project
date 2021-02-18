banned = set(["fuck", "test", "trump"])

def basic_matching(string):
    if string in banned:
        return True
    return False

def build_table_kmp(word):
    T=[0]*(len(word)+1)
    T[0] = -1
    pos = 1
    cnd = 0
    while pos<len(word):
        if word[pos] == word[cnd]:
            T[pos] = T[cnd]
        else:
            T[pos] = cnd
            while cnd >= 0 and word[pos] != word[cnd]:
                cnd = T[cnd]
        pos+=1
        cnd+=1
    T[pos] = cnd
    return T

def kmp_search(string):
    return_string = list(string)
    for word in banned:
        j = 0
        k = 0
        T = build_table_kmp(word)
        ret = []
        while j < len(string):
            if word[k] == string[j]:
                k+=1
                j+=1
                if k == len(word):
                    ret.append(j-k)
                    k = T[k]
            else:
                k = T[k]
                if k < 0:
                    j = j+1
                    k = k+1
        if len(ret)>0:
            star_word = ['*']*len(word)
            for start_index in ret:
                return_string[start_index:start_index+len(word)] = star_word
    return ''.join(return_string)

# kmp_search('hahatestlmaotrumplolfuck')