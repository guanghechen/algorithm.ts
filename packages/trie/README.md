<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/trie#readme">@algorithm.ts/trie</a>
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

> In computer science, a trie, also called digital tree or prefix tree, is a
> type of search tree, a tree data structure used for locating specific keys
> from within a set. These keys are most often strings, with links between
> nodes defined not by the entire key, but by individual characters. In order
> to access a key (to recover its value, change it, or remove it), the trie
> is traversed depth-first, following the links between nodes, which
> represent each character in the key.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/trie
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/trie
  ```

* deno

  ```typescript
  import { createTrie } from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/trie/src/index.ts'
  ```

## Usage

* Trie

  - `init(): void`: Initialize a trie.

  - `insert(str: string, v: T, start?: number, end?: number): void`:  Insert a
    string into the trie.

  - `match(str: string, start?: number, end?: number): T | null`: Find a word in
    the trie which exact match the `str.slice(start, end)`. If there is such a
    word, return its additional value, otherwise return null.

  - `hasPrefixMatched(str: string, start?: number, end?: number): boolean`:
    Check if there is a word `w` in the trie satisfied that
    `w.slice(0, end - start)` equals to `str.slice(start, end)`.

  - `find(str: string, start?: number, end?: number): TrieNodeData<T> | null`:
    Find word with smallest length in the trie which exact match the
    `str.slice(start, x)`, where the x is an integer in the range [start, _end).

  - `findAll(str: string, start?: number, end?: number): Array<TrieNodeData<T>>`:
    Find all words in the trie which exact match the
    `str.slice(start, x)`, where the x is an integer in the range [start, _end).

* Util

  - `lowercaseIdx(c: string): number`: Calc idx of lowercase English letter.
  - `uppercaseIdx(c: string): number`: Calc idx of uppercase English letter. 
  - `digitIdx(c: string): number`: Calc idx of digit character.

### Example

* A solution of https://leetcode.com/problems/word-break-ii/:

  ```typescript
  import type { ITrie } from '@algorithm.ts/trie'
  import { createTrie, lowercaseIdx } from '@algorithm.ts/trie'

  export function wordBreak(s: string, wordDict: string[]): string[] {
    if (s.length <= 0) return []

    const trie: ITrie = createTrie({
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
  ```

* A solution of https://leetcode.com/problems/word-search-ii/

  ```typescript
  import { Trie, createTrie, lowercaseIdx } from '@algorithm.ts/trie'

  function findWords(board: string[][], words: string[]): string[] {
    if (words.length === 0) return []

    const R = board.length
    if (R <= 0) return []

    const C = board[0].length
    if (C <= 0) return []

    const trie: Trie = createTrie({
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
  ```

## Related

* https://en.wikipedia.org/wiki/Trie


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/trie#readme