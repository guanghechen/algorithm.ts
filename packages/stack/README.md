<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/stack@1.0.1/packages/stack#readme">@algorithm.ts/stack</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/stack">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/stack.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/stack">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/stack.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/stack">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/stack.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/stack"
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

A typescript implementation of **Circular Stack**.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/stack
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/stack
  ```

## Usage

### CircularStack

Circular stack is a stack structure, the main purpose of its design is to reuse space as much as
possible on the basis of ordinary stacks. Circular stacks usually need to specify a capacity, if the
number of elements in the stack exceeds the capacity, only the most recent capacity elements are
kept in the stack. Other operations are the same as ordinary stacks.

- `ICircularStack`: CircularStack implements the ICircularStack interface.

  | Signature                                                         | Description                                                                      |
  | :---------------------------------------------------------------- | :------------------------------------------------------------------------------- |
  | `readonly capacity: number`                                       | The capacity of stack, which also means the max elements of the stack.           |
  | `readonly size: number`                                           | The count of the elements in the stack.                                          |
  | `at(index: number): T \| undefined`                               | Get the element at the given index.                                              |
  | `clear(): void`                                                   | Clear the stack.                                                                 |
  | `consuming(): IterableIterator<T>`                                | Popup the elements from the stack one by one.                                    |
  | `count(filter: (element: T, index: number) => boolean): number`   | Count the elements in the stack which matched by the filter.                     |
  | `pop(newElement?: T): T \| undefined`                             | Popup the top element, and push the given `newElement` if it is not `undefined`. |
  | `push(element: T): this`                                          | Push a element into the stack.                                                   |
  | `rearrange(filter: (element: T, index: number) => boolean): void` | Only preserve the elements matched the filter.                                   |
  | `resize(capacity: number): void`                                  | Resize the capacity of stack with the given size.                                |
  | `top(): T\|undefined`                                             | Get the top element from the stack.                                              |
  | `update(index: number, element: T): void`                         | Change the element at the given index.                                           |

- `ICircularStackProps`

  ```typescript
  export interface ICircularStackProps {
    /**
    * Initial capacity of the circular stack.
    */
    capacity?: number
  }
  ```

## Example

- Basic -- CircularStack

  ```typescript
  import { CircularStack } from '@algorithm.ts/stack'

  const stack = new CircularStack<{ name: string }>({ capacity: 100 })

  // Append a element to the end of the stack.
  stack.push({ name: 'alice' }) // => 0
  stack.push({ name: 'bob' }) // => 1
  stack.size          // => 2

  // Get the front element of the stack.
  stack.top()         // => { name: 'bob' }

  // Take off the first element of the stack.
  stack.pop()         // => { name: 'bob' }
  stack.size          // => 1
  ```

## Related

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/stack@1.0.1/packages/stack#readme
