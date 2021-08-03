<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/priority-queue#readme">@algorithm.ts/priority-queue</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/priority-queue">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/priority-queue.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/priority-queue">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/priority-queue.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/priority-queue">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/priority-queue.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/priority-queue"
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


A typescript implementation of **Priority Queue**, the internal data structure
is a max heap.

Priority Queue is a special queue structure, the first element of the queue
always returns to the maximum value in the queue, and the amortized time
complexity of the enqueue and dequeue operations are both $O(\log N)$.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/priority-queue
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/priority-queue
  ```

## Usage

```typescript
import { createPriorityQueue } = '@algorithm.ts/priority-queue'

const Q = createPriorityQueue<number>((x, y) => x - y)

Q.enqueue(3)
Q.enqueue(7)
Q.enqueue(1)
Q.enqueue(-5)

Q.size()      // => 4
Q.isEmpty()   // => false

Q.dequeue()   // => 7
Q.dequeue()   // => 3
Q.top()       // => 1
Q.top()       // => 1
Q.dequeue()   // => 1
Q.top()       // => -5
Q.dequeue()   // => -5
Q.top()       // => undefined
Q.dequeue()   // => undefined

Q.isEmpty()   // => true
```


## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/priority-queue#readme
