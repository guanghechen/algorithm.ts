import type { IContext, IOptions } from './Dijkstra'
import { Dijkstra } from './Dijkstra'
import type { IDijkstraGraph } from './types'

/**
 * The dijkstra algorithm, optimized with priority queue.
 *
 * @param graph
 * @param options
 * @see https://me.guanghechen.com/post/algorithm/graph/shortest-path/dijkstra
 */
export function dijkstra(
  graph: IDijkstraGraph,
  options: IOptions = {},
  onResolved?: (context: IContext) => void,
): number[] {
  // eslint-disable-next-line no-param-reassign
  if (options.dist === undefined) options.dist = []
  _dijkstra.dijkstra(graph, options, onResolved)
  return options.dist
}

const _dijkstra = new Dijkstra()
