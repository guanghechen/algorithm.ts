import type { ITrie } from '../../src'
import { createTrie } from '../../src'

export default findWords

const trie: ITrie = createTrie({
  SIGMA_SIZE: 26,
  ZERO: 0,
  idx: (c: string): number => c.codePointAt(0)! - 97,
  mergeAdditionalValues: x => x,
})

export function findWords(board: string[][], words: string[]): string[] {
  if (words.length === 0) return []

  const R = board.length
  if (R <= 0) return []

  const C = board[0].length
  if (C <= 0) return []

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
