import type { ITrie } from '../../src'
import { createTrie } from '../../src'

export default wordBreak

const trie: ITrie = createTrie({
  SIGMA_SIZE: 26,
  ZERO: 0,
  idx: (c: string): number => c.codePointAt(0)! - 97,
  mergeAdditionalValues: (x, y) => y,
})

export function wordBreak(s: string, wordDict: string[]): string[] {
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
