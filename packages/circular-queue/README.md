<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/main/packages/circular-queue#readme">@algorithm.ts/circular-queue</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/circular-queue">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/circular-queue.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/circular-queue">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/circular-queue.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/circular-queue">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/circular-queue.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/circular-queue"
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


A typescript implementation of the **Circular Queue** data structure.

Circular queue is a queue structure, the main purpose of its design is to
reuse space as much as possible on the basis of ordinary queues. Circular
queues usually need to specify the maximum volume C of the collector. If the
number of elements in the queue exceeds C, only the most recent C elements
are kept in the queue. Other operations are the same as ordinary queues.


## Install

* npm

  ```bash
  npm install --save @algorithm.ts/circular-queue
  ```

* yarn

  ```bash
  yarn add @algorithm.ts/circular-queue
  ```

* deno

  ```typescript
  import { createCircularQueue } from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/circular-queue/src/index.ts'
  ```


## Usage

* Basic:

  ```typescript
  import { createCircularQueue } from '@algorithm.ts/circular-queue'

  const queue = createCircularQueue<{ name: string }>()

  // Initialize the circular-queue with the maximum number of elements it can
  // be managed.
  queue.init(100)

  // Append a element to the end of the queue.
  queue.enqueue({ name: 'alice' })  // => 0
  queue.enqueue({ name: 'bob' }) // => 1
  queue.size()   // => 2

  // Get the front element of the queue.
  queue.front()       // => { name: 'alice' }

  // Get the last element of the queue.
  queue.end()         // => { name: 'bob' }

  // Take off the first element of the queue.
  queue.dequeue()     // => { name: 'alice' }
  queue.size()        // => 1

  // Test if the queue is empty.
  queue.isEmpty()     // => false

  queue.get(0)        // undefined
  queue.get(0, true)  // undefined
  queue.get(0, false) // { name: 'alice' }

  queue.get(1)        // => { name: 'bob' }
  queue.get(1, true)  // => { name: 'bob' }
  queue.get(1, false) // => { name: 'bob' }
  ```


## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/main/packages/circular-queue#readme
