import { Mcmf } from '../src'

type UnitEdge = readonly [from: number, to: number, cost: number]

function enumerateUnitFlows(
  nodeCount: number,
  edges: readonly UnitEdge[],
): { maxflow: number; mincost: number } {
  let maxflow = 0
  let mincost = 0
  for (let mask = 1; mask < 1 << edges.length; ++mask) {
    const balance = new Array<number>(nodeCount).fill(0)
    let cost = 0
    for (const [index, [from, to, unitCost]] of edges.entries()) {
      if ((mask & (1 << index)) === 0) continue
      balance[from] -= 1
      balance[to] += 1
      cost += unitCost
    }
    if (balance.slice(1, -1).some(value => value !== 0)) continue
    const flow = balance[nodeCount - 1]
    if (flow > maxflow || (flow === maxflow && cost < mincost)) {
      maxflow = flow
      mincost = cost
    }
  }
  return { maxflow, mincost }
}

describe('adding edges after solving', () => {
  it('moves an existing unit of flow onto a cheaper parallel edge', () => {
    const mcmf = new Mcmf()
    mcmf.init(0, 2, 3)
    mcmf.addEdge(0, 1, 1, 0)
    mcmf.addEdge(1, 2, 1, 9)
    expect(mcmf.minCostMaxFlow()).toEqual({ maxflow: 1, mincost: 9 })

    mcmf.addEdge(1, 2, 1, 1)
    expect(mcmf.minCostMaxFlow()).toEqual({ maxflow: 1, mincost: 1 })
  })

  it('reoptimizes through mincut and can lower the cost even as maxflow grows', () => {
    const mcmf = new Mcmf()
    mcmf.init(0, 3, 4)
    mcmf.addEdge(0, 1, 2, 0)
    expect(mcmf.minCostMaxFlow()).toEqual({ maxflow: 0, mincost: 0 })

    mcmf.addEdge(1, 3, 2, 9)
    expect(mcmf.minCostMaxFlow()).toEqual({ maxflow: 2, mincost: 18 })

    mcmf.addEdge(1, 2, 1, -2)
    mcmf.addEdge(2, 3, 1, 3)
    expect(mcmf.mincut()).toEqual([{ from: 0, to: 1, cap: 2, flow: 2, cost: 0 }])
    expect(mcmf.minCostMaxFlow()).toEqual({ maxflow: 2, mincost: 10 })

    mcmf.addEdge(0, 1, 2, -5)
    expect(mcmf.minCostMaxFlow()).toEqual({ maxflow: 3, mincost: 9 })
    expect(mcmf.mincut()).toEqual([
      { from: 1, to: 3, cap: 2, flow: 2, cost: 9 },
      { from: 1, to: 2, cap: 1, flow: 1, cost: -2 },
    ])
  })

  it('matches exhaustive feasible flows before and after increasing the bottleneck', () => {
    const initial: UnitEdge[] = [
      [0, 1, 0],
      [1, 3, 9],
    ]
    const optional: UnitEdge[] = [
      [1, 3, 1],
      [1, 3, -3],
      [1, 2, -2],
      [1, 2, 0],
      [2, 3, 3],
      [2, 3, 0],
    ]
    const mcmf = new Mcmf()
    for (let mask = 0; mask < 1 << optional.length; ++mask) {
      mcmf.init(0, 3, 4)
      for (const [from, to, cost] of initial) mcmf.addEdge(from, to, 1, cost)
      expect(mcmf.minCostMaxFlow()).toEqual({ maxflow: 1, mincost: 9 })

      const additions = optional.filter((_, index) => (mask & (1 << index)) !== 0)
      for (const [from, to, cost] of additions) mcmf.addEdge(from, to, 1, cost)
      const edges = [...initial, ...additions]
      expect(mcmf.minCostMaxFlow(), `edge mask ${mask}`).toEqual(enumerateUnitFlows(4, edges))

      mcmf.addEdge(0, 1, 1, 0)
      edges.push([0, 1, 0])
      expect(mcmf.minCostMaxFlow(), `expanded mask ${mask}`).toEqual(enumerateUnitFlows(4, edges))
    }
  })
})
