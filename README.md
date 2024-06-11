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

|               Package                | Description                                                                                                 |
| :----------------------------------: | :---------------------------------------------------------------------------------------------------------- |
|       [@algorithm.ts/base64][]       | A [Base64][wiki-base64] encoding implementation.                                                            |
|    [@algorithm.ts/bellman-ford][]    | Bellman-ford algorithm. #ShortestPath                                                                       |
| [@algorithm.ts/binary-index-tree][]  | Binary Index Tree.                                                                                          |
| [@algorithm.ts/bipartite-matching][] | The algorithm to find the maximum [matching][wiki-matching] of the [bipartite graph][wiki-bipartite-graph]. |
|   [@algorithm.ts/binary-search][]    | Binary search related algorithms, includes `binarySearch`, `lowerBound` and `upperBound`.                   |
|     [@algorithm.ts/calculator][]     | A tiny calculator for number arithmetics.                                                                   |
|        [@algorithm.ts/diff][]        | To find the minium difference between two subsequence or string.                                            |
|      [@algorithm.ts/dijkstra][]      | Dijkstra algorithm optimized with [priority-queue][@algorithm.ts/queue]. #ShortestPath                      |
|       [@algorithm.ts/dinic][]        | Dinic algorithm. #MaxFlow, #NetworkFlow.                                                                    |
|        [@algorithm.ts/dlx][]         | DLX algorithm.                                                                                              |
|      [@algorithm.ts/findset][]       | Find set.                                                                                                   |
|        [@algorithm.ts/gcd][]         | Greatest Common Divisor (GCD) and extended Euclidean algorithm.                                             |
|       [@algorithm.ts/graph][]        | Types and utils from solving graph problems.                                                                |
|      [@algorithm.ts/huffman][]       | A [Huffman][wiki-huffman] coding implementation.                                                            |
|        [@algorithm.ts/isap][]        | ISAP algorithm. #MaxFlow, #NetworkFlow.                                                                     |
|      [@algorithm.ts/shuffle][]       | Includes Knuth-Shuffle algorithm.                                                                           |
|        [@algorithm.ts/lcs][]         | Find the Longest Common Subsequence (include a linear space impelmentation to find a lcs).                  |
|      [@algorithm.ts/manacher][]      | The manacher algorithm for solving palindrome string problems.                                              |
|        [@algorithm.ts/mcmf][]        | MCMF algorithm. #MinCostMaxFlow, #NetworkFlow.                                                              |
|       [@algorithm.ts/queue][]        | Queues, includes priority-queue (Min Heap), circular-queue.                                                 |
|       [@algorithm.ts/roman][]        | Support the mutual conversion between Roman numerals and Arabic numerals.                                   |
|   [@algorithm.ts/sliding-window][]   | Sliding window algorithm.                                                                                   |
|       [@algorithm.ts/prime][]        | A linear time algorithm to sieve prime numbers and totient.                                                 |
|       [@algorithm.ts/sudoku][]       | A collection of utilities to generate / solve Sudoku problems.                                              |
|        [@algorithm.ts/trie][]        | Trie. (digital tree or prefix tree)                                                                         |

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
[@algorithm.ts/sudoku]: ./packages/sudoku
[@algorithm.ts/trie]: ./packages/trie
