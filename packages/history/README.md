<header>
  <h1 align="center">
    <a href="https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/history@1.0.0/packages/history#readme">@algorithm.ts/history</a>
  </h1>
  <div align="center">
    <a href="https://www.npmjs.com/package/@algorithm.ts/history">
      <img
        alt="Npm Version"
        src="https://img.shields.io/npm/v/@algorithm.ts/history.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/history">
      <img
        alt="Npm Download"
        src="https://img.shields.io/npm/dm/@algorithm.ts/history.svg"
      />
    </a>
    <a href="https://www.npmjs.com/package/@algorithm.ts/history">
      <img
        alt="Npm License"
        src="https://img.shields.io/npm/l/@algorithm.ts/history.svg"
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
        src="https://img.shields.io/node/v/@algorithm.ts/history"
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

A simple data structure to manage history through circular stack.

## Install

- npm

  ```bash
  npm install --save @algorithm.ts/history
  ```

- yarn

  ```bash
  yarn add @algorithm.ts/history
  ```

## Usage

### History

History is a fixed size stack structure, the main purpose of its design is to reuse space as much as
possible on the basis of ordinary historys. Historys usually need to specify a capacity, if the
number of elements in the history exceeds the capacity, only the most recent capacity elements are
preserved in the history. Other operations are the same as ordinary historys.

- `IHistory`: History implements the IHistory interface.

  | Signature                                                            | Description                                                                                   |
  | :------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
  | `readonly capacity: number`                                          | The capacity of the history, which also means the maximum elements of the history.            |
  | `readonly size: number`                                              | The count of the elements in the history.                                                     |
  | `readonly name: string`                                              | The name of the history.                                                                      |
  | `readonly equals: IEquals`                                           | Used to check if two element in the history are same.                                         |
  | `backward(step?: number): [element: T \| undefined, isBot: boolean]` | Backward `step` steps and return the present element of the history.                          |
  | `clear(): void`                                                      | Clear the history.                                                                            |
  | `count(filter: (element: T, index: number) => boolean): number`      | Count the elements in the history which matched the filter.                                   |
  | `fork(name: string): IHistory<T>`                                    | Create a new history from the current one.                                                    |
  | `forward(step?: number): [element: T \| undefined, isTop: boolean]`  | Forward `step` steps and return the present from the history.                                 |
  | `go(index?: number): T \| undefined`                                 | Set the present index to the given index and return the elements at the index of the history. |
  | `isBot(): boolean`                                                   | Check if the present index is at the bottom of the history.                                   |
  | `isTop(): boolean`                                                   | Check if the present index is at the top of the history.                                      |
  | `present(): [element: T \| undefined, index: number]`                | Return the present element and present index of the history.                                  |
  | `push(element: T): this`                                             | Push the element to the history.                                                              |
  | `rearrange(filter: (element: T, index: number) => boolean): void`    | Rearrange the history and only keep the elements matched the given `filter`.                  |
  | `updateTop(element: T): void`                                        | Change the top element of the history.                                                        |

- `IHistoryProps`

  ```typescript
  export interface IHistoryProps<T> {
    /**
    * The history name.
    */
    readonly name: string
    /**
    * Initial capacity of the circular history.
    */
    readonly capacity: number
    /**
    * Used to check if two element in the history are same.
    */
    readonly equals?: IEquals<T>
  }
  ```

## Example

- Basic -- CircularHistory

  ```typescript
  import { History } from '@algorithm.ts/history'

  const history = new History<{ name: string }>({ name: 'profile', capacity: 100 })

  // Append a element to the end of the history.
  history.push({ name: 'alice' }) // => 0
  history.push({ name: 'bob' }) // => 1
  history.size          // => 2

  // Get the front element of the history.
  history.present()     // => [{ name: 'bob' }, 1]
  history.backward()    // => [{ name: 'alice' }, 0]
  history.backward()    // => [{ name: 'alice' }, 0]
  history.forward()     // => [{ name: 'bob' }, 1]
  history.forward()     // => [{ name: 'bob' }, 1]
  ```

## Related

[homepage]:
  https://github.com/guanghechen/algorithm.ts/tree/@algorithm.ts/history@1.0.0/packages/history#readme
