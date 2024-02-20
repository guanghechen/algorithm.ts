import { TestOjDataProblemKey, testOjCodes } from '@@/fixtures/test-util/oj-data'
import { Isap } from '../src'

describe('basic', function () {
  it('simple', function () {
    const isap = new Isap()
    isap.init(0, 1, 4)
    isap.addEdge(0, 2, 1)
    isap.addEdge(0, 3, 2)
    isap.addEdge(3, 1, 1)
    expect(isap.maxflow()).toEqual(1)
    expect(isap.mincut()).toEqual([{ cap: 1, flow: 1, from: 3, to: 1 }])
  })
})

describe('oj', function () {
  testOjCodes(TestOjDataProblemKey.CODEFORCES_1082_G, import('./oj/codeforces-1082-g'))
  testOjCodes(
    TestOjDataProblemKey.LEETCODE_MAXIMUM_STUDENTS_TAKING_EXAM,
    import('./oj/maximum-students-taking-exam'),
  )
})
