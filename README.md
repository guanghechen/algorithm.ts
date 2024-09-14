<header>
  <div align="center">
    <a href="#license">
      <img
        alt="License"
        src="https://img.shields.io/github/license/guanghechen/algorithm.ts"
      />
    </a>
    <a href="https://github.com/guanghechen/algorithm.ts/tags">
      <img
        alt="Package Version"
        src="https://img.shields.io/github/v/tag/guanghechen/algorithm.ts?include_prereleases&sort=semver"
      />
    </a>
    <a href="https://github.com/guanghechen/algorithm.ts/search?l=typescript">
      <img
        alt="Github Top Language"
        src="https://img.shields.io/github/languages/top/guanghechen/algorithm.ts"
      />
    </a>
    <a href="https://github.com/nodejs/node">
      <img
        alt="Node.js Version"
        src="https://img.shields.io/node/v/@algorithm.ts/shuffle"
      />
    </a>
    <a href="https://github.com/guanghechen/algorithm.ts/actions/workflows/ci.yml">
      <img
        alt="CI Workflow"
        src="https://github.com/guanghechen/algorithm.ts/actions/workflows/ci.yml/badge.svg"
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

A monorepo contains some of common algorithms and data structures written in Typescript. (no
third-party dependencies)

## Migration

- Migrate from 2.x.x: https://github.com/guanghechen/algorithm.ts/blob/release-3.x.x/MIGRATION.md

## Overview

| Package                              | Version                                                   | Description                                                                                                 |
| :----------------------------------- | :-------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| [@algorithm.ts/base64][]             | [![][npm-svg/base64]][npm/base64]                         | A [Base64][wiki-base64] encoding implementation.                                                            |
| [@algorithm.ts/bellman-ford][]       | [![][npm-svg/bellman-ford]][npm/bellman-ford]             | Bellman-ford algorithm. #ShortestPath                                                                       |
| [@algorithm.ts/binary-index-tree][]  | [![][npm-svg/binary-index-tree]][npm/binary-index-tree]   | Binary Index Tree.                                                                                          |
| [@algorithm.ts/bipartite-matching][] | [![][npm-svg/bipartite-matching]][npm/bipartite-matching] | The algorithm to find the maximum [matching][wiki-matching] of the [bipartite graph][wiki-bipartite-graph]. |
| [@algorithm.ts/binary-search][]      | [![][npm-svg/binary-search]][npm/binary-search]           | Binary search related algorithms, includes `binarySearch`, `lowerBound` and `upperBound`.                   |
| [@algorithm.ts/calculator][]         | [![][npm-svg/calculator]][npm/calculator]                 | A tiny calculator for number arithmetics.                                                                   |
| [@algorithm.ts/diff][]               | [![][npm-svg/diff]][npm/diff]                             | To find the minium difference between two subsequence or string.                                            |
| [@algorithm.ts/dijkstra][]           | [![][npm-svg/dijkstra]][npm/dijkstra]                     | Dijkstra algorithm optimized with [priority-queue][@algorithm.ts/queue]. #ShortestPath                      |
| [@algorithm.ts/dinic][]              | [![][npm-svg/dinic]][npm/dinic]                           | Dinic algorithm. #MaxFlow, #NetworkFlow.                                                                    |
| [@algorithm.ts/dlx][]                | [![][npm-svg/dlx]][npm/dlx]                               | DLX algorithm.                                                                                              |
| [@algorithm.ts/findset][]            | [![][npm-svg/findset]][npm/findset]                       | Find set.                                                                                                   |
| [@algorithm.ts/gcd][]                | [![][npm-svg/gcd]][npm/gcd]                               | Greatest Common Divisor (GCD) and extended Euclidean algorithm.                                             |
| [@algorithm.ts/graph][]              | [![][npm-svg/graph]][npm/graph]                           | Types and utils from solving graph problems.                                                                |
| [@algorithm.ts/history][]            | [![][npm-svg/history]][npm/history]                       | A simple data structure to manage history through circular stack.                                           |
| [@algorithm.ts/huffman][]            | [![][npm-svg/huffman]][npm/huffman]                       | A [Huffman][wiki-huffman] coding implementation.                                                            |
| [@algorithm.ts/isap][]               | [![][npm-svg/isap]][npm/isap]                             | ISAP algorithm. #MaxFlow, #NetworkFlow.                                                                     |
| [@algorithm.ts/shuffle][]            | [![][npm-svg/shuffle]][npm/shuffle]                       | Includes Knuth-Shuffle algorithm.                                                                           |
| [@algorithm.ts/lcs][]                | [![][npm-svg/lcs]][npm/lcs]                               | Find the Longest Common Subsequence (include a linear space impelmentation to find a lcs).                  |
| [@algorithm.ts/manacher][]           | [![][npm-svg/manacher]][npm/manacher]                     | The manacher algorithm for solving palindrome string problems.                                              |
| [@algorithm.ts/mcmf][]               | [![][npm-svg/mcmf]][npm/mcmf]                             | MCMF algorithm. #MinCostMaxFlow, #NetworkFlow.                                                              |
| [@algorithm.ts/queue][]              | [![][npm-svg/queue]][npm/queue]                           | Queues, includes priority-queue (Min Heap), circular-queue.                                                 |
| [@algorithm.ts/roman][]              | [![][npm-svg/roman]][npm/roman]                           | Support the mutual conversion between Roman numerals and Arabic numerals.                                   |
| [@algorithm.ts/sliding-window][]     | [![][npm-svg/sliding-window]][npm/sliding-window]         | Sliding window algorithm.                                                                                   |
| [@algorithm.ts/stack][]              | [![][npm-svg/stack]][npm/stack]                           | Stacks, includes circular-stack.                                                                            |
| [@algorithm.ts/prime][]              | [![][npm-svg/prime]][npm/prime]                           | A linear time algorithm to sieve prime numbers and totient.                                                 |
| [@algorithm.ts/sudoku][]             | [![][npm-svg/sudoku]][npm/sudoku]                         | A collection of utilities to generate / solve Sudoku problems.                                              |
| [@algorithm.ts/trie][]               | [![][npm-svg/trie]][npm/trie]                             | Trie. (digital tree or prefix tree)                                                                         |

## License

algorithm.ts is
[MIT licensed](https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/LICENSE).

[wiki-base64]: https://en.wikipedia.org/wiki/Base64
[wiki-huffman]: https://en.wikipedia.org/wiki/Huffman_coding
[wiki-bipartite-graph]: https://en.wikipedia.org/wiki/Bipartite_graph
[wiki-matching]: https://en.wikipedia.org/wiki/Matching_(graph_theory)
[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x
[@algorithm.ts/base64]: ./packages/base64
[@algorithm.ts/bellman-ford]: ./packages/bellman-ford
[@algorithm.ts/binary-index-tree]: ./packages/binary-index-tree
[@algorithm.ts/binary-search]: ./packages/binary-search
[@algorithm.ts/bipartite-matching]: ./packages/bipartite-matching
[@algorithm.ts/calculator]: ./packages/calculator
[@algorithm.ts/diff]: ./packages/diff
[@algorithm.ts/dijkstra]: ./packages/dijkstra
[@algorithm.ts/dinic]: ./packages/dinic
[@algorithm.ts/dlx]: ./packages/dlx
[@algorithm.ts/findset]: ./packages/findset
[@algorithm.ts/gcd]: ./packages/gcd
[@algorithm.ts/graph]: ./packages/graph
[@algorithm.ts/history]: ./packages/history
[@algorithm.ts/huffman]: ./packages/huffman
[@algorithm.ts/isap]: ./packages/isap
[@algorithm.ts/shuffle]: ./packages/shuffle
[@algorithm.ts/lcs]: ./packages/lcs
[@algorithm.ts/manacher]: ./packages/manacher
[@algorithm.ts/mcmf]: ./packages/mcmf
[@algorithm.ts/queue]: ./packages/queue
[@algorithm.ts/roman]: ./packages/roman
[@algorithm.ts/prime]: ./packages/prime
[@algorithm.ts/sliding-window]: ./packages/sliding-window
[@algorithm.ts/stack]: ./packages/stack
[@algorithm.ts/sudoku]: ./packages/sudoku
[@algorithm.ts/trie]: ./packages/trie
[npm/base64]: https://www.npmjs.com/package/@algorithm.ts/base64
[npm/bellman-ford]: https://www.npmjs.com/package/@algorithm.ts/bellman-ford
[npm/binary-index-tree]: https://www.npmjs.com/package/@algorithm.ts/binary-index-tree
[npm/binary-search]: https://www.npmjs.com/package/@algorithm.ts/binary-search
[npm/bipartite-matching]: https://www.npmjs.com/package/@algorithm.ts/bipartite-matching
[npm/calculator]: https://www.npmjs.com/package/@algorithm.ts/calculator
[npm/diff]: https://www.npmjs.com/package/@algorithm.ts/diff
[npm/dijkstra]: https://www.npmjs.com/package/@algorithm.ts/dijkstra
[npm/dinic]: https://www.npmjs.com/package/@algorithm.ts/dinic
[npm/dlx]: https://www.npmjs.com/package/@algorithm.ts/dlx
[npm/findset]: https://www.npmjs.com/package/@algorithm.ts/findset
[npm/gcd]: https://www.npmjs.com/package/@algorithm.ts/gcd
[npm/graph]: https://www.npmjs.com/package/@algorithm.ts/graph
[npm/history]: https://www.npmjs.com/package/@algorithm.ts/history
[npm/huffman]: https://www.npmjs.com/package/@algorithm.ts/huffman
[npm/isap]: https://www.npmjs.com/package/@algorithm.ts/isap
[npm/shuffle]: https://www.npmjs.com/package/@algorithm.ts/shuffle
[npm/lcs]: https://www.npmjs.com/package/@algorithm.ts/lcs
[npm/manacher]: https://www.npmjs.com/package/@algorithm.ts/manacher
[npm/mcmf]: https://www.npmjs.com/package/@algorithm.ts/mcmf
[npm/queue]: https://www.npmjs.com/package/@algorithm.ts/queue
[npm/roman]: https://www.npmjs.com/package/@algorithm.ts/roman
[npm/prime]: https://www.npmjs.com/package/@algorithm.ts/prime
[npm/sliding-window]: https://www.npmjs.com/package/@algorithm.ts/sliding-window
[npm/stack]: https://www.npmjs.com/package/@algorithm.ts/stack
[npm/sudoku]: https://www.npmjs.com/package/@algorithm.ts/sudoku
[npm/trie]: https://www.npmjs.com/package/@algorithm.ts/trie
[npm-svg/base64]: https://img.shields.io/npm/v/@algorithm.ts/base64.svg
[npm-svg/bellman-ford]: https://img.shields.io/npm/v/@algorithm.ts/bellman-ford.svg
[npm-svg/binary-index-tree]: https://img.shields.io/npm/v/@algorithm.ts/binary-index-tree.svg
[npm-svg/binary-search]: https://img.shields.io/npm/v/@algorithm.ts/binary-search.svg
[npm-svg/bipartite-matching]: https://img.shields.io/npm/v/@algorithm.ts/bipartite-matching.svg
[npm-svg/calculator]: https://img.shields.io/npm/v/@algorithm.ts/calculator.svg
[npm-svg/diff]: https://img.shields.io/npm/v/@algorithm.ts/diff.svg
[npm-svg/dijkstra]: https://img.shields.io/npm/v/@algorithm.ts/dijkstra.svg
[npm-svg/dinic]: https://img.shields.io/npm/v/@algorithm.ts/dinic.svg
[npm-svg/dlx]: https://img.shields.io/npm/v/@algorithm.ts/dlx.svg
[npm-svg/findset]: https://img.shields.io/npm/v/@algorithm.ts/findset.svg
[npm-svg/gcd]: https://img.shields.io/npm/v/@algorithm.ts/gcd.svg
[npm-svg/graph]: https://img.shields.io/npm/v/@algorithm.ts/graph.svg
[npm-svg/history]: https://img.shields.io/npm/v/@algorithm.ts/history.svg
[npm-svg/huffman]: https://img.shields.io/npm/v/@algorithm.ts/huffman.svg
[npm-svg/isap]: https://img.shields.io/npm/v/@algorithm.ts/isap.svg
[npm-svg/shuffle]: https://img.shields.io/npm/v/@algorithm.ts/shuffle.svg
[npm-svg/lcs]: https://img.shields.io/npm/v/@algorithm.ts/lcs.svg
[npm-svg/manacher]: https://img.shields.io/npm/v/@algorithm.ts/manacher.svg
[npm-svg/mcmf]: https://img.shields.io/npm/v/@algorithm.ts/mcmf.svg
[npm-svg/queue]: https://img.shields.io/npm/v/@algorithm.ts/queue.svg
[npm-svg/roman]: https://img.shields.io/npm/v/@algorithm.ts/roman.svg
[npm-svg/prime]: https://img.shields.io/npm/v/@algorithm.ts/prime.svg
[npm-svg/sliding-window]: https://img.shields.io/npm/v/@algorithm.ts/sliding-window.svg
[npm-svg/stack]: https://img.shields.io/npm/v/@algorithm.ts/stack.svg
[npm-svg/sudoku]: https://img.shields.io/npm/v/@algorithm.ts/sudoku.svg
[npm-svg/trie]: https://img.shields.io/npm/v/@algorithm.ts/trie.svg
