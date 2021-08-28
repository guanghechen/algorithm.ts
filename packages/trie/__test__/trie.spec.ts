import type { Trie } from '../src'
import { createTrie } from '../src'

describe('trie', function () {
  describe('basic', function () {
    const trie: Trie = createTrie({
      SIGMA_SIZE: 62,
      ZERO: 0,
      idx: (c: string): number => {
        if (/\d/.test(c)) return c.codePointAt(0)! - 48 // digits
        if (/[A-Z]/.test(c)) return c.codePointAt(0)! - 65 // uppercase letters
        if (/[a-z]/.test(c)) return c.codePointAt(0)! - 97 // lowercase letters
        throw new TypeError(`Bad character: (${c})`)
      },
      mergeAdditionalValues: (x, y) => x + y,
    })

    test('match', function () {
      trie.init()
      trie.insert('cat', 1)
      trie.insert('cat2', 2)

      expect(trie.match('cat')).toBe(1)
      // expect(trie.match('cat2')).toBe(2)
      expect(trie.match('cat2', 0, 3)).toBe(1)
      expect(trie.match('cat3')).toBe(null)
    })

    test('findAll', function () {
      trie.init()
      trie.insert('ban', 2)
      trie.insert('banana', 1)
      trie.insert('apple', 3)

      expect(trie.find('ban')).toEqual({ end: 3, val: 2 })
      expect(trie.find('bana')).toEqual({ end: 3, val: 2 })
      expect(trie.find('banana')).toEqual({ end: 3, val: 2 })
      expect(trie.find('apple')).toEqual({ end: 5, val: 3 })
      expect(trie.find('2apple')).toEqual(null)
      expect(trie.find('2apple', 1)).toEqual({ end: 6, val: 3 })

      expect(trie.findAll('bana')).toEqual([{ end: 3, val: 2 }])
      expect(trie.findAll('banana')).toEqual([
        { end: 3, val: 2 },
        { end: 6, val: 1 },
      ])
      expect(trie.findAll('banana', 0, 3)).toEqual([{ end: 3, val: 2 }])
    })
  })
})

describe('leetcode', function () {
  test('word-break-ii', function () {
    const trie: Trie = createTrie({
      SIGMA_SIZE: 26,
      ZERO: 0,
      idx: (c: string): number => c.codePointAt(0)! - 97,
      mergeAdditionalValues: (x, y) => y,
    })

    const data: Array<{ input: [string, string[]]; answer: string[] }> = [
      {
        input: ['catsanddog', ['cat', 'cats', 'and', 'sand', 'dog']],
        answer: ['cat sand dog', 'cats and dog'],
      },
      {
        input: [
          'pineapplepenapple',
          ['apple', 'pen', 'applepen', 'pine', 'pineapple'],
        ],
        answer: [
          'pine apple pen apple',
          'pine applepen apple',
          'pineapple pen apple',
        ],
      },
      {
        input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']],
        answer: [],
      },
    ]

    for (const { input, answer } of data) {
      expect(wordBreak(input[0], input[1])).toEqual(answer)
    }

    /**
     * A solution for leetcode https://leetcode.com/problems/word-break-ii/
     *
     * @author guanghechen
     */
    function wordBreak(s: string, wordDict: string[]): string[] {
      if (s.length <= 0) return []

      trie.init()
      for (let i = 0; i < wordDict.length; ++i) {
        const word = wordDict[i]
        trie.insert(word, i + 1)
      }

      const N = s.length
      const results: string[] = []
      const collect: number[] = []
      dfs(0, 0)
      return results

      function dfs(cur: number, pos: number): void {
        if (pos === N) {
          results.push(
            collect
              .slice(0, cur)
              .map(x => wordDict[x - 1])
              .join(' '),
          )
          return
        }

        const pairs = trie.findAll(s, pos)
        for (const { end, val } of pairs) {
          collect[cur] = val
          dfs(cur + 1, end)
        }
      }
    }
  })
})
