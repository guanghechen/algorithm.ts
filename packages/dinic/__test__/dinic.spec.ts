import { TestOjDataProblemKey, testOjCodes } from '@@/fixtures/test-util/oj-data'
import { Dinic } from '../src'

describe('basic', function () {
  it('simple', function () {
    const dinic = new Dinic()
    dinic.init(0, 1, 4)
    dinic.addEdge(0, 2, 1)
    dinic.addEdge(0, 3, 2)
    dinic.addEdge(3, 1, 1)
    expect(dinic.maxflow()).toEqual(1)
    expect(dinic.mincut()).toEqual([{ cap: 1, flow: 1, from: 3, to: 1 }])
  })

  it('mincut should follow strict reachable partition definition', function () {
    const dinic = new Dinic()
    dinic.init(0, 3, 4)
    dinic.addEdge(0, 1, 10)
    dinic.addEdge(1, 3, 1)
    dinic.addEdge(1, 2, 9)
    dinic.addEdge(2, 3, 9)

    expect(dinic.maxflow()).toEqual(10)
    expect(dinic.mincut()).toEqual([{ cap: 10, flow: 10, from: 0, to: 1 }])
  })

  it('mincut should include all cut edges crossing reachable partition', function () {
    const dinic = new Dinic()
    dinic.init(0, 3, 4)
    dinic.addEdge(0, 1, 3)
    dinic.addEdge(0, 2, 2)
    dinic.addEdge(1, 2, 7)
    dinic.addEdge(1, 3, 3)
    dinic.addEdge(2, 3, 2)

    expect(dinic.maxflow()).toEqual(5)
    expect(dinic.mincut()).toEqual([
      { cap: 3, flow: 3, from: 0, to: 1 },
      { cap: 2, flow: 2, from: 0, to: 2 },
    ])
  })

  it('mincut should ignore zero-capacity edges', function () {
    const dinic = new Dinic()
    dinic.init(0, 1, 2)
    dinic.addEdge(0, 1, 0)

    expect(dinic.maxflow()).toEqual(0)
    expect(dinic.mincut()).toEqual([])
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

    const next = createRng(0x13579bdf)
    for (let n = 2; n <= 8; ++n) {
      const source = 0
      const sink = n - 1
      for (let caseIdx = 0; caseIdx < 80; ++caseIdx) {
        const dinic = new Dinic()
        dinic.init(source, sink, n)

        for (let u = 0; u < n; ++u) {
          for (let v = 0; v < n; ++v) {
            if (u === v) continue
            if (next() % 100 < 35) {
              const cap = next() % 16
              dinic.addEdge(u, v, cap)
            }
          }
        }

        const flow = dinic.maxflow()
        const cutCap = dinic.mincut().reduce((acc, edge) => acc + edge.cap, 0)
        expect(cutCap).toEqual(flow)
      }
    }
  })
})

describe('oj', function () {
  testOjCodes(TestOjDataProblemKey.CODEFORCES_1082_G, import('./oj/codeforces-1082-g'))
  testOjCodes(
    TestOjDataProblemKey.LEETCODE_MAXIMUM_STUDENTS_TAKING_EXAM,
    import('./oj/maximum-students-taking-exam'),
  )
})
