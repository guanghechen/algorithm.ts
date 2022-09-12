import type { DeepReadonly, IDigraph } from '@algorithm.ts/types'

/**
 * ExtractAdjacencyList from graph.
 * @param graph
 * @returns
 */
export const extractAdjacencyList = (graph: DeepReadonly<IDigraph>): number[][] => {
  const { N, G, edges } = graph
  const adjList: number[][] = new Array(N)
  for (let o = 0; o < N; ++o) {
    const adj: number[] = []
    for (const i of G[o]) adj.push(edges[i].to)
    adjList[o] = adj
  }
  return adjList
}

/**
 * List all points on the shortest path from source to target in order.
 * @param bestFrom
 * @param source
 * @param target
 * @returns
 */
export const getShortestPath = (
  bestFrom: ReadonlyArray<number>,
  source: number,
  target: number,
): number[] => {
  const path: number[] = [target]
  for (let x = target, parent: number; x !== source; x = parent) {
    parent = bestFrom[x]
    path.push(parent)
  }
  return path.reverse()
}

/**
 *
 * @param N     the number of nodes in the graph.
 * @param edges edges in the graph.
 * @returns An adjacency list. G[i] represent the index list of the edges start from node i.
 */
export const buildEdgeMap = (N: number, edges: ReadonlyArray<{ from: number }>): number[][] => {
  const G: number[][] = new Array(N)
  for (let o = 0; o < N; ++o) G[o] = []
  for (let i = 0; i < edges.length; ++i) {
    const edge = edges[i]
    G[edge.from].push(i)
  }
  return G
}
