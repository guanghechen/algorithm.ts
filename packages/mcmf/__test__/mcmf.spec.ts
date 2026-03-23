import { TestOjDataProblemKey, testOjCodes } from '@@/fixtures/test-util/oj-data'
import { Mcmf } from '../src'

describe('basic', function () {
  it('simple', function () {
    const mcmf = new Mcmf()
    mcmf.init(0, 1, 4)
    mcmf.addEdge(0, 2, 1, 10)
    mcmf.addEdge(0, 3, 2, 2)
    mcmf.addEdge(2, 1, 1, 9)
    mcmf.addEdge(3, 1, 1, 1)
    expect(mcmf.minCostMaxFlow()).toEqual({ mincost: 22, maxflow: 2 })
    expect(mcmf.mincut()).toEqual([
      { cap: 1, flow: 1, from: 0, to: 2, cost: 10 },
      { cap: 1, flow: 1, from: 3, to: 1, cost: 1 },
    ])
  })

  it('mincut should follow strict reachable partition definition', function () {
    const mcmf = new Mcmf()
    mcmf.init(0, 3, 4)
    mcmf.addEdge(0, 1, 10, 1)
    mcmf.addEdge(1, 3, 1, 1)
    mcmf.addEdge(1, 2, 9, 1)
    mcmf.addEdge(2, 3, 9, 1)

    expect(mcmf.minCostMaxFlow()).toEqual({ mincost: 29, maxflow: 10 })
    expect(mcmf.mincut()).toEqual([{ cap: 10, flow: 10, from: 0, to: 1, cost: 1 }])
  })

  it('mincut should include all cut edges crossing reachable partition', function () {
    const mcmf = new Mcmf()
    mcmf.init(0, 3, 4)
    mcmf.addEdge(0, 1, 3, 0)
    mcmf.addEdge(0, 2, 2, 0)
    mcmf.addEdge(1, 2, 7, 0)
    mcmf.addEdge(1, 3, 3, 0)
    mcmf.addEdge(2, 3, 2, 0)

    expect(mcmf.minCostMaxFlow()).toEqual({ mincost: 0, maxflow: 5 })
    expect(mcmf.mincut()).toEqual([
      { cap: 3, flow: 3, from: 0, to: 1, cost: 0 },
      { cap: 2, flow: 2, from: 0, to: 2, cost: 0 },
    ])
  })

  it('mincut should ignore zero-capacity edges', function () {
    const mcmf = new Mcmf()
    mcmf.init(0, 1, 2)
    mcmf.addEdge(0, 1, 0, 42)

    expect(mcmf.minCostMaxFlow()).toEqual({ mincost: 0, maxflow: 0 })
    expect(mcmf.mincut()).toEqual([])
  })

  it('mincut capacity should equal maxflow on random small graphs', function () {
    const createRng = (seed: number): (() => number) => {
      let state = seed % 2147483647
      if (state <= 0) state += 2147483646
      return (): number => {
        state = (state * 48271) % 2147483647
        return state
      }
    }

    const next = createRng(0x2468ace)
    for (let n = 2; n <= 8; ++n) {
      const source = 0
      const sink = n - 1
      for (let caseIdx = 0; caseIdx < 80; ++caseIdx) {
        const mcmf = new Mcmf()
        mcmf.init(source, sink, n)

        for (let u = 0; u < n; ++u) {
          for (let v = 0; v < n; ++v) {
            if (u === v) continue
            if (next() % 100 < 35) {
              const cap = next() % 16
              const cost = next() % 5
              mcmf.addEdge(u, v, cap, cost)
            }
          }
        }

        const { maxflow } = mcmf.minCostMaxFlow()
        const cutCap = mcmf.mincut().reduce((acc, edge) => acc + edge.cap, 0)
        expect(cutCap).toEqual(maxflow)
      }
    }
  })
})

describe('oj', function () {
  testOjCodes(TestOjDataProblemKey.CODEFORCES_0277_E, import('./oj/codeforces-0277-e'))
  testOjCodes(TestOjDataProblemKey.CODEFORCES_1082_G, import('./oj/codeforces-1082-g'))
  testOjCodes(
    TestOjDataProblemKey.LEETCODE_MAXIMUM_STUDENTS_TAKING_EXAM,
    import('./oj/maximum-students-taking-exam'),
  )
})
