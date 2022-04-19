import type { IEdge, IGraph } from '../src'
import { buildEdgeMap } from '../src'

describe('util', function () {
  test('buildEdgeMap', function () {
    const Nodes = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
    }
    const N: number = Object.keys(Nodes).length
    const edges: Array<IEdge & { from: number }> = [
      { from: Nodes.A, to: Nodes.B, cost: 1 }, // A-B (1)
      { from: Nodes.B, to: Nodes.A, cost: -1 }, // B-A (-1)
      { from: Nodes.B, to: Nodes.C, cost: 0.87 }, // B-C (0.87)
      { from: Nodes.C, to: Nodes.B, cost: -0.87 }, // C-B (-0.87)
      { from: Nodes.C, to: Nodes.D, cost: 5 }, // C-D (5)
      { from: Nodes.D, to: Nodes.C, cost: -5 }, // D-C (-5)
    ]
    const G: number[][] = buildEdgeMap(N, edges)
    const graph: IGraph = { N, edges, G }

    const totalEdges: number = graph.G.reduce((acc, g) => acc + g.length, 0)
    expect(totalEdges).toEqual(graph.edges.length)
    for (let from = 0; from < N; ++from) {
      for (const i of graph.G[from]) {
        const edge = edges[i]
        expect(edge.from).toEqual(from)
      }
    }
  })
})
