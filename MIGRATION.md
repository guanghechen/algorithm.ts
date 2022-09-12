## From 2.x.x

### @algorithm.ts/base64

No breaking changes.


### @algorithm.ts/bellman-ford

1.  Constructor: Only the `INF` props reserved, the `from`, `dist`, `inq`, `inqTimes` are not
    supported anymore.
2.  Get shortest path: no builtin `getShortestPathTo` anymore, call the `getShortestPath` from the
    `@algorithm.ts/graph` instead.
3.  `bellmanFord` returns a structured result instead of a boolean value.

    ```typescript
    export type IBellmanFordResult<C extends number | bigint> =
      | {
          // There is at least one negative cycle in the graph, so the shortest path is not existed.
          hasNegativeCycle: true
        }
      | {
          hasNegativeCycle: false
          /**
          * A big number, representing the unreachable cost.
          */
          INF: C
          /**
          * Source point
          */
          source: number
          /**
          * Record the shortest path parent source point to the specified point.
          * For example: bestFrom[x] represents the previous position of x in the shortest path
          *              parent the source point to x.
          */
          bestFrom: ReadonlyArray<number>
          /**
          * An array recording the shortest distance to the source point.
          */
          dist: ReadonlyArray<C>
        }
    ```


### @algorithm.ts/binary-index-tree

1. `createBinaryIndexTree1` is removed, use `SingleUpdateIntervalQuery` instead.
2. `createBinaryIndexTree2` is removed, use `SingleUpdateIntervalQuery` instead.
3. No builtin modulo binary index tree, perform the modulus operations through customized `add`
   method:

    ```typescript
    import { SingleUpdateIntervalQuery } from '@algorithm.ts/binary-index-tree'
    const MOD = 1e9 + 7
    const bit = SingleUpdateIntervalQuery<number>({
      operator: {
        ZERO: 0,
        add: (x, y) => ((x + y) % MOD + MOD) % MOD,
      },
    })
   ```

### @algorithm.ts/bipartite-graph-matching

1. Renamed to `@algorithm.ts/bipartite-matching`.
2. Use `new HungarianDfs()` (or `new HungarianBfs()`) instead of `createBipartiteGraphMatching`


### @algorithm.ts/calculate

1. Renamed to `@algorithm.ts/calculator`.
2. Use `calculator.calculate(<expression>)` instead of `calculate(<expression>)`.


## @algorithm.ts/circular-queue

This package is removed, use `@algorithm.ts/queue` instead.

1. Use `.size` instead of `.size()`.
3. `.end()` is renamed to `.back()`.
4. `.get()` is removed.
5. `.set()` is removed.
6. `.isValidIndex()` is removed.
7. `.isEmpty()` is removed, use `.size > 0` instead.



### @algorithm.ts/dijkstra

1.  `dijkstra` returns a structured result instead of a number array.

    ```typescript
    export interface IDijkstraResult<C extends number | bigint> {
      /**
      * A big number, representing the unreachable cost.
      */
      INF: C
      /**
      * Source point
      */
      source: number
      /**
      * Record the shortest path parent source point to the specified point.
      * For example: bestFrom[x] represents the previous position of x in the shortest path
      *              parent the source point to x.
      */
      bestFrom: ReadonlyArray<number>
      /**
      * An array recording the shortest distance to the source point.
      */
      dist: ReadonlyArray<C>
    }
    ```

### @algorithm.ts/dijkstra-bigint

Removed, use `@algorithm.ts/dijkstra` instead.

```typescript
import { dijkstraBigint } from '@algorithm.ts/dijkstra'
```


### @algorithm.ts/dinic

1. Use `new Dinic()` instead of `createDinic()` 
2. `.maxFlow()` is renamed to `.maxflow()`
3. `.solve()` is removed, if you want to access the residual network after run the `.maxflow()`, 
    you can try to extend the `Dinic` and export a method such as `getSnapshot()`.

    ```typescript
    class CustomDinic extends Dinic {
      public getSnapshot() {
        return {
          N: this._N,
          source: this._source,
          sink: this._sink,
          G: this.G,
          edges: this._edges,
          edgesTot: this._edgesTot,
          dist: this._dist
        }
      }
    }
    ```

### @algorithm.ts/dlx

1. Use `new DancingLinkX({ MAX_N: <number> })` instead of `createDLX(<number>)` 


### @algorithm.ts/findset

1. Use `new Findset()` instead of `createFindset()`.
2. Use `new HeuristicFindset()` instead of `createHeuristicFindset()`.
3. Use `new EnhancedFindset()` instead of `createEnhancedFindset()`.
4. `.size(<number>)` is renamed to `.count(<number>)`.
5. `.resetNode(<number>)` is removed.


### @algorithm.ts/gcd

No breaking changes.


### @algorithm.ts/gomoku

No breaking changes.


### @algorithm.ts/graph

1. The graph related types is moved to `@algorithm.ts/types`.


### @algorithm.ts/huffman

1. `buildEncodingTable` is renamed to `toEncodingTable`.
2. `buildHuffmanTree` is renamed to `fromEncodingTable`.
3. `createHuffmanTree` is renamed to `fromText`.


### @algorithm.ts/isap

1. Use `new Isap()` instead of `createIsap()` 
2. `.maxFlow()` is renamed to `.maxflow()`
3. `.solve()` is removed, if you want to access the residual network after run the `.maxflow()`, 
    you can try to extend the `Isap` and export a method such as `getSnapshot()`.

    ```typescript
    class CustomIsap extends Isap {
      public getSnapshot() {
        return {
          N: this._N,
          source: this._source,
          sink: this._sink,
          G: this.G,
          edges: this._edges,
          edgesTot: this._edgesTot,
          dist: this._dist
        }
      }
    }
    ```


### @algorithm.ts/knuth-shuffle

1. Renamed to `@algorithm.ts/shuffle`.


### @algorithm.ts/lcs

No breaking changes.


### @algorithm.ts/lower-bound

This package is removed, use `@algorithm.ts/binary-search` instead.

```typescript
import { lowerBound } from '@algorithm.ts/binary-search'
```


### @algorithm.ts/manacher

1. Return `number[]` instead of `Uint32Array`.


### @algorithm.ts/mcmf

1. Use `new Mcmf()` instead of `createMcmf()` 
2. `.minCostMaxFlow()` return an object instead of tuple.
3. `.solve()` is removed, if you want to access the residual network after run the `.maxflow()`, 
    you can try to extend the `Mcmf` and export a method such as `getSnapshot()`.

    ```typescript
    class CustomMcmf extends Mcmf {
      public getSnapshot() {
        return {
          N: this._N,
          source: this._source,
          sink: this._sink,
          G: this.G,
          edges: this._edges,
          edgesTot: this._edgesTot,
          dist: this._dist
        }
      }
    }
    ```


## @algorithm.ts/priority-queue

This package is removed, use `@algorithm.ts/queue` instead.

1. !!! Priority queue is a Min-Heap now (previous version is a Max-Heap).
2. Use `.size` instead of `.size()`.
3. `.top()` is renamed to `.front()`.
4. `.replaceTop(newElement)` is removed, use `Q.dequeue(newElement)` instead.
5. `.isEmpty()` is removed, use `.size > 0` instead.
6. `.collect()` is removed, use `Array.from(Q)` instead.


### @algorithm.ts/roman

No breaking changes.


### @algorithm.ts/sieve-prime

1. Renamed to `@algorithm.ts/prime`.


### @algorithm.ts/sieve-totient

1. This package is removed, use `@algorithm.ts/prime` instead.

    ```typescript
    import { sieveTotient } from '@algorithm.ts/prime'
    ```



### @algorithm.ts/sliding-window

1. Use `new SlidingWindow(options)` instead of `createSlidingWindow(cmp)`.
2. `max()` is removed, use `min()` instead. The sliding-window is maintain the minimum value index
   now (the previous version will maintain the maximum value in the window).
3. Rename `moveForward` to `forwardRightBoundary`.
4. Support to move the left boundary of the sliding-window through the new method `forwardLeftBoundary`.
5. `init()` is renamed to `reset()`, and the parameters is changed to object style. 


### @algorithm.ts/sudoku

1. Use one-dimension array to record a sudoku puzzle / solution data. (Previous version were using
   two-dimension array).

   Once you still want to get a two-dimension array, here is an example shows that.

    ```typescript
    import { toMatrixStyleBoardData } from '@algorithm.ts/sudoku'

    // Convert the two-dimensional array to one-dimensional array.
    const puzzle = oldStylePuzzle.flat()

    solver.solve(puzzle, solution)

    // Convert the one-dimensional array to two-dimensional array.
    const oldStyleSolution = toMatrixStyleBoardData(solution)
    ```

2. `createSudokuBoard()` is renamed to `createSudokuBoardData()`.
3. `fillSudokuBoard()` is renamed to `fillSudokuBoardData()`.
4. `copySudokuBoard()` is renamed to `copySudokuBoardData()`.
5. `checkSudokuSolution` is renamed to `checkSudokuSolution`.


### @algorithm.ts/trie

1. `.insert()` is renamed to `.set()`. 
2. `.math()` is renamed to `.get()`.
3. `.hasPrefixMatched` is renamed to `.hasPrefix()`.
4. `.init()` is removed, use `.clear()` to initialize trie.



### @algorithm.ts/upper-bound

1. This package is removed, use `@algorithm.ts/binary-search` instead.

    ```typescript
    import { upperBound } from '@algorithm.ts/binary-search'
    ```
