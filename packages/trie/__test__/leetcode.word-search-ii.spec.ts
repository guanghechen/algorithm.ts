import type { ITrie } from '../src'
import { createTrie, lowercaseIdx } from '../src'

test('word-search-ii', function () {
  const data: Array<{ input: [string[][], string[]]; answer: string[] }> = [
    {
      input: [
        [
          ['o', 'a', 'a', 'n'],
          ['e', 't', 'a', 'e'],
          ['i', 'h', 'k', 'r'],
          ['i', 'f', 'l', 'v'],
        ],
        ['oath', 'pea', 'eat', 'rain'],
      ],
      answer: ['oath', 'eat'],
    },
    {
      input: [
        [
          ['a', 'b'],
          ['c', 'd'],
        ],
        ['abcb'],
      ],
      answer: [],
    },
  ]
  for (const { input, answer } of data) {
    expect(findWords(input[0], input[1])).toEqual(answer)
  }
})

/**
 * A solution of https://leetcode.com/problems/word-search-ii/
 *
 * @author guanghechen
 */

function findWords(board: string[][], words: string[]): string[] {
  if (words.length === 0) return []

  const R = board.length
  if (R <= 0) return []

  const C = board[0].length
  if (C <= 0) return []

  const trie: ITrie = createTrie({
    SIGMA_SIZE: 26,
    ZERO: 0,
    idx: lowercaseIdx,
    mergeAdditionalValues: x => x,
  })

  trie.init()

  const visited: boolean[][] = new Array(R)
  for (let r = 0; r < R; ++r) visited[r] = new Array(C).fill(false)

  const boardWord: string[] = []
  for (let r = 0; r < R; ++r) {
    for (let c = 0; c < C; ++c) {
      dfs(0, r, c)
    }
  }

  const results: string[] = []
  for (const word of words) {
    if (trie.hasPrefixMatched(word)) results.push(word)
  }
  return results

  function dfs(cur: number, r: number, c: number): void {
    if (cur === 10 || r < 0 || r >= R || c < 0 || c >= C) {
      trie.insert(boardWord.join(''), 1, 0, cur)
      return
    }

    if (visited[r][c]) return

    visited[r][c] = true
    boardWord[cur] = board[r][c]

    const nextCur: number = cur + 1
    dfs(nextCur, r - 1, c)
    dfs(nextCur, r, c + 1)
    dfs(nextCur, r + 1, c)
    dfs(nextCur, r, c - 1)
    visited[r][c] = false
  }
}
