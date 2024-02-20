import type { DeepReadonly, ICompare } from '@algorithm.ts/internal'
import type { IDigraph, IDigraphEdge } from '@algorithm.ts/types'
import { buildEdgeMap, extractAdjacencyList, getShortestPath } from '../src'

const enum Nodes {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
}

const graph: DeepReadonly<IDigraph<IDigraphEdge & { from: Nodes; cost: number }>> = {
  N: 4,
  G: [[0], [1, 2], [3, 4], [5]],
  edges: [
    { from: Nodes.A, to: Nodes.B, cost: 1 }, // A-B (1)
    { from: Nodes.B, to: Nodes.A, cost: -1 }, // B-A (-1)
    { from: Nodes.B, to: Nodes.C, cost: 0.87 }, // B-C (0.87)
    { from: Nodes.C, to: Nodes.B, cost: -0.87 }, // C-B (-0.87)
    { from: Nodes.C, to: Nodes.D, cost: 5 }, // C-D (5)
    { from: Nodes.D, to: Nodes.C, cost: -5 }, // D-C (-5)
  ],
}

describe('util', function () {
  it('extractAdjacencyList', function () {
    const adjList: number[][] = extractAdjacencyList(graph)
    for (let o = 0; o < graph.N; ++o) {
      expect(graph.G[o].length).toEqual(adjList[o].length)
      const set1: Set<number> = new Set(adjList[o])
      const set2: Set<number> = new Set(graph.G[o].map(i => graph.edges[i].to))
      const compare: ICompare<number> = (x, y) => x - y
      expect(Array.from(set1).sort(compare)).toEqual(Array.from(set2).sort(compare))
    }
  })

  it('getShortestPath', function () {
    const bestFrom: number[] = [-1, 0, 1, 2]
    expect(getShortestPath(bestFrom, 0, 0)).toEqual([0])
    expect(getShortestPath(bestFrom, 0, 1)).toEqual([0, 1])
    expect(getShortestPath(bestFrom, 0, 2)).toEqual([0, 1, 2])
    expect(getShortestPath(bestFrom, 0, 3)).toEqual([0, 1, 2, 3])
  })

  it('buildEdgeMap', function () {
    const G: number[][] = buildEdgeMap(graph.N, graph.edges)
    expect(G).toEqual(graph.G)
  })
})
