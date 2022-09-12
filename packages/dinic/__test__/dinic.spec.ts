import { TestOjDataProblemKey, testOjCodes } from '@@/fixtures/test-util/oj-data'
import { Dinic } from '../src'

describe('basic', function () {
  test('simple', function () {
    const dinic = new Dinic()
    dinic.init(0, 1, 4)
    dinic.addEdge(0, 2, 1)
    dinic.addEdge(0, 3, 2)
    dinic.addEdge(3, 1, 1)
    expect(dinic.maxflow()).toEqual(1)
    expect(dinic.mincut()).toEqual([{ cap: 1, flow: 1, from: 3, to: 1 }])
  })
})

describe('oj', function () {
  testOjCodes(TestOjDataProblemKey.CODEFORCES_1082_G, import('./oj/codeforces-1082-g'))
  testOjCodes(
    TestOjDataProblemKey.LEETCODE_MAXIMUM_STUDENTS_TAKING_EXAM,
    import('./oj/maximum-students-taking-exam'),
  )
})
