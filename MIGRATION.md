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

1. Perform class style API, use `new Dinic()` instead of `createDinic()` 
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
