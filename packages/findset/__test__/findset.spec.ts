/* eslint-disable no-param-reassign */
import { randomInt } from '@algorithm.ts/knuth-shuffle'
import type { EnhancedFindset } from '../src'
import {
  createEnhancedFindset,
  createFindset,
  createHeuristicFindset,
} from '../src'

describe('createfindset', function () {
  const MAX_N = 1000
  const findset = createFindset(MAX_N)

  test('basic', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    findset.merge(1, 3)
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).not.toBe(findset.root(3))

    findset.merge(2, 3)
    expect(findset.root(1)).toBe(findset.root(2))
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).toBe(findset.root(3))

    // Duplicate merge.
    findset.merge(1, 2)
    expect(findset.root(1)).toBe(findset.root(2))
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).toBe(findset.root(3))

    for (let i = 4; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    findset.initNode(2)
    findset.initNode(3)
    expect(findset.root(2)).toBe(2)
    expect(findset.root(3)).toBe(3)
  })

  test('out of boundary', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.root(-1)).toThrow(/Out of boundary/)
    expect(() => findset.root(0)).toThrow(/Out of boundary/)
    expect(() => findset.root(MAX_N + 1)).toThrow(/Out of boundary/)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.init(0)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
    expect(() => findset.init(1)).not.toThrow()
    expect(() => findset.init(MAX_N)).not.toThrow()
    expect(() => findset.init(MAX_N + 1)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
  })
})

describe('createHeuristicfindset', function () {
  const MAX_N = 1000
  const findset = createHeuristicFindset(MAX_N)

  test('basic', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    findset.merge(1, 3)
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).not.toBe(findset.root(3))

    findset.merge(2, 3)
    expect(findset.root(1)).toBe(findset.root(2))
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).toBe(findset.root(3))

    // Duplicate merge.
    findset.merge(1, 2)
    expect(findset.root(1)).toBe(findset.root(2))
    expect(findset.root(1)).toBe(findset.root(3))
    expect(findset.root(2)).toBe(findset.root(3))

    for (let i = 4; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    findset.initNode(2)
    findset.initNode(3)
    expect(findset.root(2)).toBe(2)
    expect(findset.size(2)).toBe(1)
    expect(findset.root(3)).toBe(3)
    expect(findset.size(3)).toBe(1)
  })

  test('out of boundary', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.root(-1)).toThrow(/Out of boundary/)
    expect(() => findset.root(0)).toThrow(/Out of boundary/)
    expect(() => findset.root(MAX_N + 1)).toThrow(/Out of boundary/)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.init(0)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
    expect(() => findset.init(1)).not.toThrow()
    expect(() => findset.init(MAX_N)).not.toThrow()
    expect(() => findset.init(MAX_N + 1)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
  })

  test('size', function () {
    findset.init(MAX_N)
    for (let i = 0; i < 100; ++i) {
      const x = randomInt(MAX_N - 1) + 1
      const y = randomInt(MAX_N - 1) + 1
      findset.merge(x, y)
    }

    let count = 0
    for (let i = 1; i <= MAX_N; ++i) {
      if (findset.root(i) === i) count += findset.size(i)
    }
    expect(count).toBe(MAX_N)
  })
})

describe('enhanced-findset', function () {
  const MAX_N = 10
  const findset = createEnhancedFindset(MAX_N)

  test('init', function () {
    findset.init(5)
    for (let x = 1; x <= 5; ++x) {
      expect(Array.from(findset.getSetOf(x)!)).toEqual([x])
    }
    for (let x = 6; x <= 10; ++x) {
      expect(Array.from(findset.getSetOf(x)!)).toEqual([])
    }
  })

  test('merge', function () {
    findset.init(MAX_N)
    findset.merge(2, 3)
    expect(findset.size(2)).toEqual(2)
    expect(findset.size(3)).toEqual(2)
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([2, 3])
    expect(Array.from(findset.getSetOf(3)!).sort()).toEqual([2, 3])

    findset.merge(1, 2)
    expect(findset.size(1)).toEqual(3)
    expect(findset.size(2)).toEqual(3)
    expect(Array.from(findset.getSetOf(1)!).sort()).toEqual([1, 2, 3])
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([1, 2, 3])

    findset.merge(1, 1)
    expect(findset.size(1)).toEqual(3)
    expect(Array.from(findset.getSetOf(1)!).sort()).toEqual([1, 2, 3])
    expect(Array.from(findset.getSetOf(2)!).sort()).toEqual([1, 2, 3])
  })

  test('out of boundary', function () {
    findset.init(MAX_N)
    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.root(-1)).toThrow(/Out of boundary/)
    expect(() => findset.root(0)).toThrow(/Out of boundary/)
    expect(() => findset.root(MAX_N + 1)).toThrow(/Out of boundary/)

    for (let i = 1; i <= MAX_N; ++i) expect(findset.root(i)).toBe(i)

    expect(() => findset.init(0)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
    expect(() => findset.init(1)).not.toThrow()
    expect(() => findset.init(MAX_N)).not.toThrow()
    expect(() => findset.init(MAX_N + 1)).toThrow(
      /Invalid value, expect an integer in the range of/,
    )
  })
})

describe('leetcode', function () {
  test('2092 Find All People With Secret', function () {
    const solve = createSolve()
    const data: Array<{ input: Parameters<typeof solve>; answer: number[] }> = [
      {
        input: [
          6,
          [
            [1, 2, 5],
            [2, 3, 8],
            [1, 5, 10],
          ],
          1,
        ],
        answer: [0, 1, 2, 3, 5],
      },
      {
        input: [
          4,
          [
            [3, 1, 3],
            [1, 2, 2],
            [0, 3, 3],
          ],
          3,
        ],
        answer: [0, 1, 3],
      },
      {
        input: [
          5,
          [
            [3, 4, 2],
            [1, 2, 1],
            [2, 3, 1],
          ],
          1,
        ],
        answer: [0, 1, 2, 3, 4],
      },
      {
        input: [
          6,
          [
            [0, 2, 1],
            [1, 3, 1],
            [4, 5, 1],
          ],
          1,
        ],
        answer: [0, 1, 2, 3],
      },
    ]
    for (const kase of data) {
      const [N, meetings, firstPerson] = kase.input
      expect(solve(N, meetings, firstPerson)).toEqual(kase.answer)
    }

    function createSolve(): (
      N: number,
      meetings: number[][],
      firstPerson: number,
    ) => number[] {
      const MAX_N = 1e5 + 10
      const answer: Set<number> = new Set()
      const nodes: Set<number> = new Set()
      const visited: Uint8Array = new Uint8Array(MAX_N)
      const findset: EnhancedFindset = createEnhancedFindset(MAX_N)

      return function findAllPeople(
        N: number,
        meetings: number[][],
        firstPerson: number,
      ): number[] {
        const M: number = meetings.length

        answer.clear()
        answer.add(1)
        answer.add(firstPerson + 1)

        meetings
          .sort((x, y) => x[2] - y[2])
          .forEach(item => {
            item[0] += 1
            item[1] += 1
          })

        for (let i = 0, j: number; i < M; i = j) {
          const t: number = meetings[i][2]
          for (j = i + 1; j < M; ++j) {
            if (meetings[j][2] !== t) break
          }

          nodes.clear()
          for (let k = i; k < j; ++k) {
            const [x, y] = meetings[k]
            nodes.add(x)
            nodes.add(y)
          }

          for (const x of nodes) {
            findset.initNode(x)
            visited[x] = 0
          }

          for (let k = i; k < j; ++k) {
            const [x, y] = meetings[k]
            findset.merge(x, y)
          }

          for (const x of nodes) {
            if (!answer.has(x)) continue

            const xx: number = findset.root(x)
            if (visited[xx]) continue
            visited[xx] = 1

            const xxSet: Set<number> = findset.getSetOf(xx)!
            for (const t of xxSet) answer.add(t)
          }
        }

        return Array.from(answer)
          .map(x => x - 1)
          .sort((x, y) => x - y)
      }
    }
  })
})
