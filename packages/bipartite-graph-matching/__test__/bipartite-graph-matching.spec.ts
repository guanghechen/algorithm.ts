import type { ITestData } from 'jest.setup'
import { loadCommonJsonFixtures } from 'jest.setup'
import { createBipartiteGraphMatching } from '../src'
import { maxStudents } from './oj/maximum-students-taking-exam'

describe('basic', function () {
  test('exceptional', function () {
    const matching = createBipartiteGraphMatching()
    expect(() => matching.init(0)).toThrow(/The number of nodes should be greater than zero/)
    expect(() => matching.init(-1)).toThrow(/The number of nodes should be greater than zero/)
  })

  test('perfectMatch', function () {
    const matching = createBipartiteGraphMatching()
    matching.init(4)
    expect(matching.perfectMatch()).toBe(false)

    matching.addEdge(0, 1)
    matching.addEdge(0, 2)
    matching.addEdge(0, 3)
    expect(matching.perfectMatch()).toBe(false)

    matching.addEdge(1, 2)
    matching.addEdge(1, 3)
    matching.addEdge(2, 3)
    expect(matching.perfectMatch()).toBe(true)

    matching.init(4)
    expect(matching.perfectMatch()).toBe(false)

    matching.init(4)
    matching.addEdge(0, 1)
    matching.addEdge(2, 3)
    expect(matching.perfectMatch()).toBe(true)

    matching.init(3)
    matching.addEdge(0, 1)
    matching.addEdge(0, 2)
    matching.addEdge(1, 2)
    expect(matching.perfectMatch()).toBe(false)
  })
})

describe('oj', function () {
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
