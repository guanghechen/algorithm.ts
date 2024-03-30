<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/queue@4.0.0/packages/queue#readme">@algorithm.ts/queue</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/queue">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/queue.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/queue">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/queue.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/queue">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/queue.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/queue"
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

A typescript implementation of **Priority Queue** (based on min-heap) and **Circular Queue**.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/queue
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/queue
  ```

## Usage

### PriorityQueue

Priority Queue is a special queue structure, the first element of the queue always returns to the
minimum value in the queue, and the amortized time complexity of the enqueue and dequeue operations
are both $O(\log N)$.

- `IPriorityQueue`: PriorityQueue implements the IPriorityQueue interface.

  |                                    Signature                                     | Description                                                                      |
  | :------------------------------------------------------------------------------: | :------------------------------------------------------------------------------- |
  |                        `consuming(): IterableIterator<T>`                        | Popup the elements from the queue by the `dequeue` order.                        |
  |                 `count(filter: (element: T) => boolean): number`                 | Count the elements in the queue which matched by the filter.                     |
  |                     `dequeue(newElement?: T): T\|undefined`                      | Popup the top element, and push the given `newElement` if it is not `undefined`. |
  |                             `enqueue(val: T): void`                              | Push a element into the priority queue.                                          |
  |                     `enqueues(elements: Iterable<T>): void`                      | Push multiple elements into the priority queue.                                  |
  | `enqueues_advance(elements: ReadonlyArray<T>, start: number, end: number): void` | Push multiple elements into the priority queue.                                  |
  |                 `exclude(filter: (element: T) => boolean): void`                 | Remove elements matched the filter.                                              |
  |                                `destroy(): void`                                 | Destroy the queue and release the memory.                                        |
  |                             `front(): T\|undefined`                              | Get the top element from the priority queue.                                     |
  |                    `init(initialElements?: Iterable<T>: void`                    | Initialize priority queue with initial elements.                                 |
  |                             `readonly size: number`                              | Get the number of elements.                                                      |
  |                           `readonly destroyed: number`                           | Indicate whether the priority queue destroyed.                                   |

- `IPriorityQueueProps`

  ```typescript
  export interface IPriorityQueueProps<T> {
    /**
    * If the compare(x, y) < 0, then x has a higher precedence than y.
    */
    compare: ICompare<T>
  }
  ```

  - `new PriorityQueue<number>({ compare: (x, y) => x - y })`: The top element has a minimum value.
  - `new PriorityQueue<number>({ compare: (x, y) => y - x })`: The top element has a maximum value.

### CircularQueue

Circular queue is a queue structure, the main purpose of its design is to reuse space as much as
possible on the basis of ordinary queues. Circular queues usually need to specify the maximum volume
C of the collector. If the number of elements in the queue exceeds C, only the most recent C
elements are kept in the queue. Other operations are the same as ordinary queues.

- `ICircularQueue`: CircularQueue implements the ICircularQueue interface.

  |                                    Signature                                     | Description                                                                      |
  | :------------------------------------------------------------------------------: | :------------------------------------------------------------------------------- |
  |                        `consuming(): IterableIterator<T>`                        | Popup the elements from the queue by the `dequeue` order.                        |
  |                 `count(filter: (element: T) => boolean): number`                 | Count the elements in the queue which matched by the filter.                     |
  |                     `dequeue(newElement?: T): T\|undefined`                      | Popup the top element, and push the given `newElement` if it is not `undefined`. |
  |                             `enqueue(val: T): void`                              | Push a element into the circular queue.                                          |
  |                     `enqueues(elements: Iterable<T>): void`                      | Push multiple elements into the circular queue.                                  |
  | `enqueues_advance(elements: ReadonlyArray<T>, start: number, end: number): void` | Push multiple elements into the circular queue.                                  |
  |                 `exclude(filter: (element: T) => boolean): void`                 | Remove elements matched the filter.                                              |
  |                                `destroy(): void`                                 | Destroy the queue and release the memory.                                        |
  |                             `front(): T\|undefined`                              | Get the first enqueued element from the circular queue.                          |
  |                              `back(): T\|undefined`                              | Get the last enqueued element from the circular queue.                           |
  |                    `init(initialElements?: Iterable<T>: void`                    | Initialize circular queue with initial elements.                                 |
  |                         `resize(MAX_SIZE: number): void`                         | Resize the max-size of queue with the given size.                                |
  |                               `rearrange(): void`                                | Rearrange elements, that is, put the first element in place 0-index.             |
  |                             `readonly size: number`                              | Get the number of elements.                                                      |
  |                           `readonly destroyed: number`                           | Indicate whether the circular queue destroyed.                                   |

- `ICircularQueueProps`

  ```typescript
  export interface ICircularQueueProps {
    /**
    * Initial capacity of the circular queue.
    */
    capacity?: number
    /**
    * Automatically extends the queue capacity when the queue is full.
    * @default true
    */
    autoResize?: boolean
    /**
    * @default 1.5
    */
    autoResizeExpansionRatio?: number
  }
  ```

## Example

- Basic -- PriorityQueue

  ```typescript
  import { PriorityQueue } = '@algorithm.ts/queue'

  const Q = new PriorityQueue<number>({ compare: (x, y) => y - x })

  Q.enqueue(3)
  Q.enqueue(7)
  Q.enqueue(-5)
  Q.enqueue(1)
  Q.size        // => 4
  Array.from(Q) // => [7, 3, -5, 1] !!!NOTE: the result are not guaranteed to be ordered.

  Q.dequeue()   // => 7
  Q.dequeue()   // => 3
  Q.front()     // => 1
  Q.front()     // => 1
  Q.dequeue()   // => 1
  Q.front()     // => -5
  Q.dequeue()   // => -5
  Q.front()     // => undefined
  Q.dequeue()   // => undefined
  ```

- Basic -- CircularQueue

  ```typescript
  import { CircularQueue } from '@algorithm.ts/queue'

  const queue = new CircularQueue<{ name: string }>()

  // Initialize the circular-queue with the maximum number of elements it can
  // be managed.
  queue.init(100)

  // Append a element to the end of the queue.
  queue.enqueue({ name: 'alice' }) // => 0
  queue.enqueue({ name: 'bob' }) // => 1
  queue.size          // => 2

  // Get the front element of the queue.
  queue.front()       // => { name: 'alice' }

  // Get the last element of the queue.
  queue.back()        // => { name: 'bob' }

  // Take off the first element of the queue.
  queue.dequeue()     // => { name: 'alice' }
  queue.size          // => 1
  ```

- A solution for 剑指 offer#63 https://www.nowcoder.com/practice/9be0172896bd43948f8a32fb954e1be1

  ```typescript
  import { PriorityQueue } from '@algorithm.ts/queue'

  const lowerQ = new PriorityQueue<number>({ compare: (x, y) => x - y })
  const upperQ = new PriorityQueue<number>({ compare: (x, y) => y - x })

  export function Insert(num: number): void {
    if (lowerQ.size === upperQ.size) {
      upperQ.enqueue(num)
      lowerQ.enqueue(upperQ.dequeue()!)
    } else {
      lowerQ.enqueue(num)
      upperQ.enqueue(lowerQ.dequeue()!)
    }
  }

  export function GetMedian(): number {
    return lowerQ.size === upperQ.size
      ? (lowerQ.front()! + upperQ.front()!) / 2
      : lowerQ.front()!
  }
  ```

## Related

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/queue@4.0.0/packages/queue#readme
