<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/trie@4.0.0/packages/trie#readme">@algorithm.ts/trie</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/trie">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/trie.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/trie">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/trie.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/trie">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/trie.svg"
      />
    </a>
    <a href="#install">
      <img
        alt="Module Formats: cjs, esm"
        src="https://img.shields.io/badge/module_formats-cjs%2C%20esm-green.svg"
      />
    </a>
    <a href="https://github.com/nodejs/node">
      <img
        alt="Node.js Version"
        src="https://img.shields.io/node/v/@algorithm.ts/trie"
      />
    </a>
    <a href="https://github.com/facebook/jest">
      <img
        alt="Tested with Jest"
        src="https://img.shields.io/badge/tested_with-jest-9c465e.svg"
      />
    </a>
    <a href="https://github.com/prettier/prettier">
      <img
        alt="Code Style: prettier"
        src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
      />
    </a>
  </div>
</header>
<br/>

A typescript implementation of the **TRIE** data structure.

The following definition is quoted from Wikipedia (https://en.wikipedia.org/wiki/Trie):

> In computer science, a trie, also called digital tree or prefix tree, is a type of search tree, a
> tree data structure used for locating specific keys from within a set. These keys are most often
> strings, with links between nodes defined not by the entire key, but by individual characters. In
> order to access a key (to recover its value, change it, or remove it), the trie is traversed
> depth-first, following the links between nodes, which represent each character in the key.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/trie
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/trie
  ```

## Usage

- Trie

- Util

  - `digitIdx(c: string): number`: Calc idx of digit character.
  - `uppercaseIdx(c: string): number`: Calc idx of uppercase English letter.
  - `lowercaseIdx(c: string): number`: Calc idx of lowercase English letter.
  - `alphaNumericIdx(c: string): number`: Calc idx of digit, lowercase/uppercase English leter.

### Example

- A solution of https://leetcode.com/problems/word-break-ii/:

  ```typescript
  import type { ITrie } from '@algorithm.ts/trie'
  import { Trie, lowercaseIdx } from '@algorithm.ts/trie'

  const trie: ITrie<string, number> = new Trie<string, number>({
    SIGMA_SIZE: 26,
    idx: lowercaseIdx,
    mergeNodeValue: (_x, y) => y,
  })

  export function wordBreak(text: string, wordDict: string[]): string[] {
    if (text.length <= 0) return []

    trie.init()
    for (let i = 0; i < wordDict.length; ++i) {
      const word = wordDict[i]
      trie.set(word, i)
    }

    const N = text.length
    const results: string[] = []
    const collect: number[] = []
    dfs(0, 0)
    return results

    function dfs(cur: number, pos: number): void {
      if (pos === N) {
        results.push(
          collect
            .slice(0, cur)
            .map(x => wordDict[x])
            .join(' '),
        )
        return
      }

      for (const { end, val } of trie.findAll_advance(text, pos, text.length)) {
        collect[cur] = val
        dfs(cur + 1, end)
      }
    }
  }
  ```

- A solution of https://leetcode.com/problems/word-search-ii/

  ```typescript
  import { Trie, lowercaseIdx } from '@algorithm.ts/trie'

  class CustomTrie<E extends unknown[] | string, V> extends Trie<E, V> {
    public getSnapshot(): { ch: Uint32Array[]; values: Array<V | undefined> } {
      return {
        ch: this._ch,
        values: this._values,
      }
    }
  }

  const trie = new CustomTrie<string, number>({
    SIGMA_SIZE: 26,
    idx: lowercaseIdx,
    mergeNodeValue: (x, _y) => x,
  })

  export function findWords(board: string[][], words: string[]): string[] {
    const N = words.length
    const R = board.length
    const C = board[0].length
    if (N <= 0 || R <= 0 || C <= 0) return []

    trie.init()
    for (let i = 0; i < N; ++i) trie.set(words[i], i)

    const boardCode: number[][] = []
    for (let r = 0; r < R; ++r) {
      const codes: number[] = []
      for (let c = 0; c < C; ++c) codes[c] = board[r][c].charCodeAt(0) - 97
      boardCode[r] = codes
    }

    const visited: boolean[][] = new Array(R)
    for (let r = 0; r < R; ++r) visited[r] = new Array(C).fill(false)

    let matchedWordCount = 0
    const isWordMatched: boolean[] = new Array(N).fill(false)

    const { ch, values } = trie.getSnapshot()
    for (let r = 0; r < R; ++r) {
      for (let c = 0; c < C; ++c) {
        dfs(0, r, c)
      }
    }

    const results: string[] = words.filter((_w, i) => isWordMatched[i])
    return results

    function dfs(u: number, r: number, c: number): void {
      if (visited[r][c] || matchedWordCount === N) return

      const u2: number = ch[u][boardCode[r][c]]
      if (u2 === 0) return

      const val = values[u2]
      if (val !== undefined && !isWordMatched[val]) {
        isWordMatched[val] = true
        matchedWordCount += 1
      }

      visited[r][c] = true
      if (r > 0) dfs(u2, r - 1, c)
      if (c + 1 < C) dfs(u2, r, c + 1)
      if (r + 1 < R) dfs(u2, r + 1, c)
      if (c > 0) dfs(u2, r, c - 1)
      visited[r][c] = false
    }
  }
  ```

## Related

- https://en.wikipedia.org/wiki/Trie

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/trie@4.0.0/packages/trie#readme
