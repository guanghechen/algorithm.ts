import type { IDigraph, IDigraphEdge } from '@algorithm.ts/graph.types'
import type { DeepReadonly, ICompare } from '@algorithm.ts/internal'
import { buildEdgeMap, extractAdjacencyList, getShortestPath, topoSort } from '../src'

enum Nodes {
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

describe('util', () => {
  it('extractAdjacencyList', () => {
    const adjList: number[][] = extractAdjacencyList(graph)
    for (let o = 0; o < graph.N; ++o) {
      expect(graph.G[o].length).toEqual(adjList[o].length)
      const set1: Set<number> = new Set(adjList[o])
      const set2: Set<number> = new Set(graph.G[o].map(i => graph.edges[i].to))
      const compare: ICompare<number> = (x, y) => x - y
      expect(Array.from(set1).sort(compare)).toEqual(Array.from(set2).sort(compare))
    }
  })

  it('getShortestPath', () => {
    const bestFrom: number[] = [-1, 0, 1, 2]
    expect(getShortestPath(bestFrom, 0, 0)).toEqual([0])
    expect(getShortestPath(bestFrom, 0, 1)).toEqual([0, 1])
    expect(getShortestPath(bestFrom, 0, 2)).toEqual([0, 1, 2])
    expect(getShortestPath(bestFrom, 0, 3)).toEqual([0, 1, 2, 3])
  })

  describe('getShortestPath boundaries', () => {
    it('stops at the requested source without following its predecessor', () => {
      const bestFrom = Object.freeze([2, 1, 3, -1])
      expect(getShortestPath(bestFrom, 2, 0)).toEqual([2, 0])
      expect(getShortestPath(bestFrom, 3, 0)).toEqual([3, 2, 0])
      expect(getShortestPath(bestFrom, 1, 1)).toEqual([1])
    })

    it.each([
      { name: 'unreachable target', parents: [-1, -1], target: 1 },
      { name: 'chain ending at another root', parents: [-1, -1, 1], target: 2 },
      { name: 'self-loop', parents: [-1, 1], target: 1 },
      { name: 'chain entering a cycle', parents: [-1, 2, 1, 2], target: 3 },
    ])('returns an empty path for $name', ({ parents, target }) => {
      let reads = 0
      const bestFrom = new Proxy(parents, {
        get(table, key, receiver) {
          if (key !== 'length' && ++reads > table.length) {
            throw new Error('Too many predecessor reads')
          }
          return Reflect.get(table, key, receiver)
        },
      })
      expect(getShortestPath(bestFrom, 0, target)).toEqual([])
    })
  })

  it('buildEdgeMap', () => {
    const G: number[][] = buildEdgeMap(graph.N, graph.edges)
    expect(G).toEqual(graph.G)
  })

  it('topoSort', () => {
    const topo: number[] = topoSort(graph)
    expect(topo).toEqual([Nodes.D, Nodes.C, Nodes.B, Nodes.A])
  })
})
