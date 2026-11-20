import type { IIsapEdge } from '../src'
import { Isap } from '../src'
import { TestOjDataProblemKey, testOjCodes } from '@@/fixtures/test-util/oj-data'

type TestEdge = readonly [from: number, to: number, cap: number]

function enumerateMinimumCut(
  edges: readonly TestEdge[],
  nodeCount: number,
  source: number,
  sink: number,
): { flow: number; cut: IIsapEdge[] } {
  const outgoing = (side: number): TestEdge[] =>
    edges.filter(
      ([from, to, cap]) => cap > 0 && (side & (1 << from)) !== 0 && (side & (1 << to)) === 0,
    )
  let minimum = Infinity
  let commonSourceSide = 0
  for (let side = 0; side < 1 << nodeCount; ++side) {
    if ((side & (1 << source)) === 0 || (side & (1 << sink)) !== 0) continue
    const capacity = outgoing(side).reduce((sum, [, , cap]) => sum + cap, 0)
    if (capacity < minimum) {
      minimum = capacity
      commonSourceSide = side
    } else if (capacity === minimum) {
      commonSourceSide &= side
    }
  }
  return {
    flow: minimum,
    cut: outgoing(commonSourceSide).map(([from, to, cap]) => ({ from, to, cap, flow: cap })),
  }
}

describe('basic', () => {
  it('simple', () => {
    const isap = new Isap()
    isap.init(0, 1, 4)
    isap.addEdge(0, 2, 1)
    isap.addEdge(0, 3, 2)
    isap.addEdge(3, 1, 1)
    expect(isap.maxflow()).toEqual(1)
    expect(isap.mincut()).toEqual([{ cap: 1, flow: 1, from: 3, to: 1 }])
  })

  it('mincut should use strict reachable partition instead of all saturated edges', () => {
    const isap = new Isap()
    isap.init(0, 3, 4)
    isap.addEdge(0, 1, 10)
    isap.addEdge(1, 3, 1)
    isap.addEdge(1, 2, 9)
    isap.addEdge(2, 3, 9)

    expect(isap.maxflow()).toEqual(10)
    expect(isap.mincut()).toEqual([{ cap: 10, flow: 10, from: 0, to: 1 }])
  })

  it('finds both augmenting paths despite a dead end', () => {
    const isap = new Isap()
    isap.init(0, 4, 5)
    isap.addEdge(0, 1, 2)
    isap.addEdge(1, 2, 1)
    isap.addEdge(1, 3, 1)
    isap.addEdge(1, 4, 1)
    isap.addEdge(3, 4, 1)

    expect(isap.maxflow()).toBe(2)
    expect(isap.mincut()).toEqual([{ from: 0, to: 1, cap: 2, flow: 2 }])
  })

  it('reroutes existing flow through a reverse edge after adding edges', () => {
    const isap = new Isap()
    isap.init(0, 5, 6)
    for (let from = 0; from < 5; ++from) isap.addEdge(from, from + 1, 1)
    expect(isap.maxflow()).toBe(1)

    isap.addEdge(0, 2, 1)
    isap.addEdge(1, 5, 1)
    expect(isap.maxflow()).toBe(2)
    expect(isap.mincut()).toEqual([
      { from: 0, to: 1, cap: 1, flow: 1 },
      { from: 0, to: 2, cap: 1, flow: 1 },
    ])
  })

  it('cancels two previous assignments along a single augmenting path', () => {
    const isap = new Isap()
    isap.init(0, 7, 8)
    for (const [left, right] of [
      [1, 4],
      [2, 5],
    ]) {
      isap.addEdge(0, left, 1)
      isap.addEdge(left, right, 1)
      isap.addEdge(right, 7, 1)
    }
    expect(isap.maxflow()).toBe(2)

    isap.addEdge(0, 3, 1)
    isap.addEdge(3, 4, 1)
    isap.addEdge(1, 5, 1)
    isap.addEdge(2, 6, 1)
    expect(isap.maxflow()).toBe(2)

    isap.addEdge(6, 7, 1)
    expect(isap.maxflow()).toBe(3)
  })

  it('changes the cut without changing maxflow and preserves parallel edge multiplicity', () => {
    const isap = new Isap()
    isap.init(2, 0, 4)
    isap.addEdge(2, 1, 1)
    isap.addEdge(2, 1, 1)
    isap.addEdge(1, 0, 2)
    isap.addEdge(1, 2, 7)
    isap.addEdge(2, 2, 5)
    isap.addEdge(2, 3, 0)
    isap.addEdge(3, 0, 9)
    expect(isap.mincut()).toEqual([
      { from: 2, to: 1, cap: 1, flow: 1 },
      { from: 2, to: 1, cap: 1, flow: 1 },
    ])
    expect(isap.maxflow()).toBe(2)

    isap.addEdge(2, 1, 1)
    expect(isap.mincut()).toEqual([{ from: 1, to: 0, cap: 2, flow: 2 }])
    expect(isap.maxflow()).toBe(2)
  })

  it('resets cached flow and cut when changing graph size and terminals', () => {
    const isap = new Isap()
    for (const [nodeCount, source, sink, cap] of [
      [6, 4, 0, 2 ** 32 + 1],
      [2, 1, 0, 2],
      [5, 1, 3, 4],
    ]) {
      isap.init(source, sink, nodeCount)
      isap.addEdge(sink, source, cap)
      expect(isap.maxflow()).toBe(0)
      expect(isap.mincut()).toEqual([])

      isap.addEdge(source, sink, cap)
      expect(isap.mincut()).toEqual([{ from: source, to: sink, cap, flow: cap }])
      expect(isap.maxflow()).toBe(cap)
    }
  })

  it.each([
    { family: 'five-node DAGs', nodeCount: 5, source: 0, sink: 4, forwardOnly: true },
    { family: 'four-node digraphs', nodeCount: 4, source: 2, sink: 1, forwardOnly: false },
  ])('matches exhaustive cut enumeration on $family', family => {
    const { nodeCount, source, sink, forwardOnly } = family
    const possibleEdges: TestEdge[] = []
    for (let from = 0; from < nodeCount; ++from) {
      for (let to = 0; to < nodeCount; ++to) {
        if (from !== to && (!forwardOnly || from < to)) {
          possibleEdges.push([from, to, from === source ? 2 : 1])
        }
      }
    }

    const isap = new Isap()
    for (let edgeMask = 0; edgeMask < 1 << possibleEdges.length; ++edgeMask) {
      const edges = possibleEdges.filter((_, index) => (edgeMask & (1 << index)) !== 0)
      isap.init(source, sink, nodeCount)
      for (const [from, to, cap] of edges) isap.addEdge(from, to, cap)

      const flow = isap.maxflow()
      const cut = isap
        .mincut()
        .sort((first, second) => first.from - second.from || first.to - second.to)
      const expected = enumerateMinimumCut(edges, nodeCount, source, sink)
      expect({ flow, cut }, `edge mask ${edgeMask}`).toEqual(expected)
    }
  })
})

describe('oj', () => {
  testOjCodes(TestOjDataProblemKey.CODEFORCES_1082_G, import('./oj/codeforces-1082-g'))
  testOjCodes(
    TestOjDataProblemKey.LEETCODE_MAXIMUM_STUDENTS_TAKING_EXAM,
    import('./oj/maximum-students-taking-exam'),
  )
})
