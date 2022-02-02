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
        src="https://img.shields.io/node/v/@algorithm.ts/knuth-shuffle"
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


A monorepo contains some of common algorithms and data structures written in
Typescript. (no third-party dependencies)


## Overview

Package                             | Description
:----------------------------------:|:--------------------------
[@algorithm.ts/base64][]            | A [Base64][wiki-base64] encoding implementation.
[@algorithm.ts/bellman-ford][]      | Bellman-ford algorithm. #ShortestPath
[@algorithm.ts/binary-index-tree][] | Binary Index Tree.
[@algorithm.ts/calculate][]         | A tiny calculator for number arithmetics.
[@algorithm.ts/circular-queue][]    | Circular queue.
[@algorithm.ts/dijkstra][]          | Dijkstra algorithm optimized with [@algorithm.ts/priority-queue][]. #ShortestPath
[@algorithm.ts/dijkstra-bigint][]   | Dijkstra algorithm (bigint version) optimized with [@algorithm.ts/priority-queue][]. #ShortestPath
[@algorithm.ts/dinic][]             | Dinic algorithm. #MaxFlow, #NetworkFlow.
[@algorithm.ts/dlx][]               | DLX algorithm.
[@algorithm.ts/findset][]           | Find set.
[@algorithm.ts/gcd][]               | Greatest Common Divisor (GCD) and extended Euclidean algorithm.
[@algorithm.ts/huffman][]           | A [Huffman][wiki-huffman] coding implementation.
[@algorithm.ts/isap][]              | ISAP algorithm. #MaxFlow, #NetworkFlow.
[@algorithm.ts/knuth-shuffle][]     | Knuth-Shuffle algorithm.
[@algorithm.ts/lower-bound][]       | Find the index of first elements which greater or equals than the target element.
[@algorithm.ts/manacher][]          | The manacher algorithm for solving palindrome string problems.
[@algorithm.ts/mcmf][]              | MCMF algorithm. #MinCostMaxFlow, #NetworkFlow.
[@algorithm.ts/priority-queue][]    | Priority Queue (heap).
[@algorithm.ts/roman][]             | Support the mutual conversion between Roman numerals and Arabic numerals.
[@algorithm.ts/sliding-window][]    | Sliding window algorithm.
[@algorithm.ts/sieve-prime][]       | A linear time algorithm to sieve prime numbers.
[@algorithm.ts/sieve-totient][]     | A linear time algorithm to sieve prime numbers and get the Euler's totient function.
[@algorithm.ts/sudoku][]            | A collection of utilities to generate / solve Sudoku problems.
[@algorithm.ts/trie][]              | Trie. (digital tree or prefix tree)
[@algorithm.ts/upper-bound][]       | Find the index of first elements which greater than the target element.


## License

algorithm.ts is [MIT licensed](https://github.com/guanghechen/algorithm.ts/blob/main/LICENSE).

[wiki-base64]: https://en.wikipedia.org/wiki/Base64
[wiki-huffman]: https://en.wikipedia.org/wiki/Huffman_coding

[homepage]: https://github.com/guanghechen/algorithm.ts
[@algorithm.ts/base64]: ./packages/base64
[@algorithm.ts/bellman-ford]: ./packages/bellman-ford
[@algorithm.ts/binary-index-tree]: ./packages/binary-index-tree
[@algorithm.ts/calculate]: ./packages/calculate
[@algorithm.ts/circular-queue]: ./packages/circular-queue
[@algorithm.ts/dijkstra]: ./packages/dijkstra
[@algorithm.ts/dijkstra-bigint]: ./packages/dijkstra-bigint
[@algorithm.ts/dinic]: ./packages/dinic
[@algorithm.ts/dlx]: ./packages/dlx
[@algorithm.ts/findset]: ./packages/findset
[@algorithm.ts/gcd]: ./packages/gcd
[@algorithm.ts/huffman]: ./packages/huffman
[@algorithm.ts/isap]: ./packages/isap
[@algorithm.ts/knuth-shuffle]: ./packages/knuth-shuffle
[@algorithm.ts/lower-bound]: ./packages/lower-bound
[@algorithm.ts/manacher]: ./packages/manacher
[@algorithm.ts/mcmf]: ./packages/mcmf
[@algorithm.ts/priority-queue]: ./packages/priority-queue
[@algorithm.ts/roman]: ./packages/roman
[@algorithm.ts/sieve-prime]: ./packages/sieve-prime
[@algorithm.ts/sieve-totient]: ./packages/sieve-totient
[@algorithm.ts/sliding-window]: ./packages/sliding-window
[@algorithm.ts/sudoku]: ./packages/sudoku
[@algorithm.ts/trie]: ./packages/trie
[@algorithm.ts/upper-bound]: ./packages/upper-bound
