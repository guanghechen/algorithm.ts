<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/priority-queue#readme">@algorithm.ts/priority-queue</a>
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

* deno

  ```typescript
  import { createPriorityQueue } from 'https://raw.githubusercontent.com/guanghechen/algorithm.ts/main/packages/priority-queue/src/index.ts'
  ```

## Usage

* `IPriorityQueue`

  Member                                                                        | Return        |  Description
  :----------------------------------------------------------------------------:|:-------------:|:---------------------------------------
  `init(elements?: T[], startPos?: number, endPos?: number)`                    | `void`        | Initialize priority queue with initial elements.
  `enqueue(val: T)`                                                             | `void`        | Drop a element into the priority queue.
  `enqueues(elements: T[], startIndex?: number, endIndex?: number)`             | `void`        | Drop multiple elements into the priority queue.
  `dequeue()`                                                                   | `T|undefined` | Popup the top element.
  `splice(filter, newElements?: T[], startIndex?: number, endIndex?: number)`   | `void`        | Remove existed elements which is not passed the filter, then enqueues the additional elements.
  `replaceTop(newElement: T)`                                                   | `void`        | Replace top element with new one. (If the queue is empty, then the newElement will be enqueued.)
  `top()`                                                                       | `T|undefined` | Get the top element.
  `size()`                                                                      | `number`      | Return the number of elements of the priority queue.
  `isEmpty()`                                                                   | `boolean`     | Check if the priority queue is empty.
  `collect()`                                                                   | `T[]`         | Return all of the elements of the priority queue.

* `createPriorityQueue`

  ```typescript
  export function createPriorityQueue<T>(
    cmp: (x: T, y: T) => -1 | 0 | 1 | number,
  ): IPriorityQueue<T>
  ```

  - `createPriorityQueue<number>((x, y) => x - y)`: The top element has a maximum value.
  - `createPriorityQueue<number>((x, y) => y - x)`: The top element has a minimum value.

### Example

* Basic

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

* A solution for 剑指offer#63 https://www.nowcoder.com/practice/9be0172896bd43948f8a32fb954e1be1

  ```typescript
  import { createPriorityQueue } from '@algorithm.ts/priority-queue'

  const lowerQ = createPriorityQueue<number>((x, y) => x - y)
  const upperQ = createPriorityQueue<number>((x, y) => y - x)

  export function Insert(num: number): void {
    if (lowerQ.size() === upperQ.size()) {
      upperQ.enqueue(num)
      lowerQ.enqueue(upperQ.dequeue()!)
    } else {
      lowerQ.enqueue(num)
      upperQ.enqueue(lowerQ.dequeue()!)
    }
  }

  export function GetMedian(): number {
    return lowerQ.size() === upperQ.size()
      ? (lowerQ.top()! + upperQ.top()!) / 2
      : lowerQ.top()!
  }
  ```

## Related


[homepage]: https://github.com/guanghechen/algorithm.ts/tree/release-2.x.x/packages/priority-queue#readme
