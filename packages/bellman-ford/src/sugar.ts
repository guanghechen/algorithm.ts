import type { IContext, IOptions } from './BellmanFord'
import { BellmanFord } from './BellmanFord'
import type { IGraph } from './types'

/**
 * The bellman-ford algorithm, optimized with queue.
 *
 * @param graph
 * @param options
 */
export function bellmanFord(
  graph: IGraph,
  options: IOptions = {},
  onResolved?: (context: IContext) => void,
): boolean {
  return _bellmanFord.bellmanFord(graph, options, onResolved)
}

const _bellmanFord = new BellmanFord()
