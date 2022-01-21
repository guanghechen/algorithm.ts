import type { Trie } from '../src'
import { createTrie, lowercaseIdx } from '../src'

test('word-break-ii', function () {
  const data: Array<{ input: [string, string[]]; answer: string[] }> = [
    {
      input: ['catsanddog', ['cat', 'cats', 'and', 'sand', 'dog']],
      answer: ['cat sand dog', 'cats and dog'],
    },
    {
      input: ['pineapplepenapple', ['apple', 'pen', 'applepen', 'pine', 'pineapple']],
      answer: ['pine apple pen apple', 'pine applepen apple', 'pineapple pen apple'],
    },
    {
      input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']],
      answer: [],
    },
  ]

  for (const { input, answer } of data) {
    expect(wordBreak(input[0], input[1])).toEqual(answer)
  }
})

/**
 * A solution of https://leetcode.com/problems/word-break-ii/
 *
 * @author guanghechen
 */
function wordBreak(s: string, wordDict: string[]): string[] {
  if (s.length <= 0) return []

  const trie: Trie = createTrie({
    SIGMA_SIZE: 26,
    ZERO: 0,
    idx: lowercaseIdx,
    mergeAdditionalValues: (x, y) => y,
  })

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
