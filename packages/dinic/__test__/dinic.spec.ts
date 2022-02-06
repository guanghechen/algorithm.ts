import type { ITestData } from 'jest.setup'
import { loadCommonJsonFixtures } from 'jest.setup'
import { createDinic } from '../src'
import { solveCodeforces1082G } from './oj/codeforces-1082-g'
import { maxStudents } from './oj/maximum-students-taking-exam'

describe('basic', function () {
  test('simple', function () {
    const dinic = createDinic()
    dinic.init(0, 1, 4)
    dinic.addEdge(0, 2, 1)
    dinic.addEdge(0, 3, 2)
    dinic.addEdge(3, 1, 1)
    expect(dinic.maxFlow()).toEqual(1)
    dinic.solve(context => expect(context).toMatchSnapshot())
  })
})

describe('oj', function () {
  // https://codeforces.com/contest/1082/problem/G
  test('codeforces/1082/G', function () {
    type IParameters = Parameters<typeof solveCodeforces1082G>
    type IAnswer = ReturnType<typeof solveCodeforces1082G>
    const data: Array<ITestData<IParameters, IAnswer>> = loadCommonJsonFixtures('codeforces/1082/G')

    for (const { input, answer } of data) expect(solveCodeforces1082G(...input)).toEqual(answer)
  })

  // https://leetcode.com/problems/maximum-students-taking-exam/
  test('leetcode/maximum-students-taking-exam', function () {
    type IParameters = Parameters<typeof maxStudents>
    type IAnswer = ReturnType<typeof maxStudents>
    const data: Array<ITestData<IParameters, IAnswer>> = loadCommonJsonFixtures(
      'leetcode/maximum-students-taking-exam',
    )

    for (const { input, answer } of data) expect(maxStudents(...input)).toEqual(answer)
  })
})
