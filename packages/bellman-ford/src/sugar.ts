import { BIGINT_ZERO } from '@algorithm.ts/_constant'
import type { DeepReadonly } from '@algorithm.ts/types'
import { BellmanFord } from './BellmanFord'
import type { IBellmanFordGraph, IBellmanFordOptions, IBellmanFordResult } from './types'

/**
 * The bellman-ford algorithm, optimized with queue.
 *
 * @param graph
 * @param options
 */
let _bellmanFord: BellmanFord<number> | null = null
export const bellmanFord = (
  graph: DeepReadonly<IBellmanFordGraph<number>>,
  options: IBellmanFordOptions<number> = {},
): IBellmanFordResult<number> => {
  if (_bellmanFord === null) {
    _bellmanFord = new BellmanFord<number>({
      ZERO: 0,
      INF: Math.floor(Number.MAX_SAFE_INTEGER / 2) - 1,
    })
  }
  return _bellmanFord.bellmanFord(graph, options)
}

/**
 * The bellman-ford algorithm, optimized with queue. (bigint version)
 *
 * @param graph
 * @param options
 */
let _bellmanFordBigint: BellmanFord<bigint> | null = null
export const bellmanFordBigint = (
  graph: DeepReadonly<IBellmanFordGraph<bigint>>,
  options: IBellmanFordOptions<bigint> = {},
): IBellmanFordResult<bigint> => {
  if (_bellmanFordBigint === null) {
    _bellmanFordBigint = new BellmanFord<bigint>({
      ZERO: BIGINT_ZERO,
      INF: BigInt(Number.MAX_SAFE_INTEGER),
    })
  }
  return _bellmanFordBigint.bellmanFord(graph, options)
}
