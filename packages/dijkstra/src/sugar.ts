import { BIGINT_ZERO } from '@algorithm.ts/constant'
import type { DeepReadonly } from '@algorithm.ts/types'
import { Dijkstra } from './Dijkstra'
import type { IDijkstraGraph, IDijkstraOptions, IDijkstraResult } from './types'

/**
 * The dijkstra algorithm, optimized with priority queue.
 *
 * @param graph
 * @param options
 * @see https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
 */
let _dijkstra: Dijkstra<number> | null = null
export const dijkstra = (
  graph: DeepReadonly<IDijkstraGraph<number>>,
  options: IDijkstraOptions<number> = {},
): IDijkstraResult<number> => {
  if (_dijkstra === null) {
    _dijkstra = new Dijkstra<number>({
      ZERO: 0,
      INF: Math.floor(Number.MAX_SAFE_INTEGER / 2) - 1,
    })
  }
  return _dijkstra.dijkstra(graph, options)
}

/**
 * The dijkstra algorithm, optimized with priority queue. (bigint version)
 *
 * @param graph
 * @param options
 * @see https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
 */
let _dijkstraBigint: Dijkstra<bigint> | null = null
export const dijkstraBigint = (
  graph: DeepReadonly<IDijkstraGraph<bigint>>,
  options: IDijkstraOptions<bigint> = {},
): IDijkstraResult<bigint> => {
  if (_dijkstraBigint === null) {
    _dijkstraBigint = new Dijkstra<bigint>({
      ZERO: BIGINT_ZERO,
      INF: BigInt(Number.MAX_SAFE_INTEGER),
    })
  }
  return _dijkstraBigint.dijkstra(graph, options)
}
