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
      { cap: 1, flow: 1, from: 2, to: 1, cost: 9 },
      { cap: 1, flow: 1, from: 3, to: 1, cost: 1 },
    ])
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
