import { testOjCodes } from 'jest.setup'
import { createMcmf } from '../src'

describe('basic', function () {
  test('simple', function () {
    const mcmf = createMcmf()
    mcmf.init(0, 1, 4)
    mcmf.addEdge(0, 2, 1, 10)
    mcmf.addEdge(0, 3, 2, 2)
    mcmf.addEdge(2, 1, 1, 9)
    mcmf.addEdge(3, 1, 1, 1)
    expect(mcmf.minCostMaxFlow()).toEqual([22, 2])
    mcmf.solve(context => expect(context).toMatchSnapshot())
  })
})

describe('oj', function () {
  // https://codeforces.com/contest/277/problem/E
  testOjCodes('codeforces/0277/E', import('./oj/codeforces-0277-e'))

  // https://codeforces.com/contest/1082/problem/G
  testOjCodes('codeforces/1082/G', import('./oj/codeforces-1082-g'))

  // https://leetcode.com/problems/maximum-students-taking-exam/
  testOjCodes('leetcode/maximum-students-taking-exam', import('./oj/maximum-students-taking-exam'))
})
