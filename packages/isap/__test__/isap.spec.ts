import { testOjCodes } from 'jest.setup'
import { createIsap } from '../src'

describe('basic', function () {
  test('simple', function () {
    const isap = createIsap()
    isap.init(0, 1, 4)
    isap.addEdge(0, 2, 1)
    isap.addEdge(0, 3, 2)
    isap.addEdge(3, 1, 1)
    expect(isap.maxFlow()).toEqual(1)
    isap.solve(context => expect(context).toMatchSnapshot())
  })
})

describe('oj', function () {
  // https://codeforces.com/contest/1082/problem/G
  testOjCodes('codeforces/1082/G', import('./oj/codeforces-1082-g'))

  // https://leetcode.com/problems/maximum-students-taking-exam/
  testOjCodes('leetcode/maximum-students-taking-exam', import('./oj/maximum-students-taking-exam'))
})
