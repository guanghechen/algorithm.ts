import { findLCSOfEveryRightPrefix, findLengthOfLCS, findMinLexicographicalLCS } from '../src'

describe('basic', () => {
  it('findLengthOfLCS', function () {
    const lenOf = (s1: string | number[], s2: string | number[]): number =>
      findLengthOfLCS(s1.length, s2.length, (x, y) => s1[x] === s2[y])

    expect(
      lenOf('f8d1d155-d14e-433f-88e1-07b54f184740', 'a00322f7-256e-46fe-ae91-8de835c57778'),
    ).toEqual(12)
    expect(lenOf('abcde', 'ace')).toEqual(3)
    expect(lenOf('ace', 'abcde')).toEqual(3)
    expect(lenOf('abc', 'abc')).toEqual(3)
    expect(lenOf('abc', 'abce')).toEqual(3)
    expect(lenOf('', 'abce')).toEqual(0)
    expect(lenOf('abce', '')).toEqual(0)
    expect(lenOf('', '')).toEqual(0)
    expect(lenOf([1, 2, 3, 4, 6, 6, 7, 8, 6], [2, 3, 4, 7, 9, 8, 2, 3, 5, 2])).toEqual(5)
    expect(lenOf('abeep boop', 'beep boob blah')).toEqual(8)
  })

  it('findMinLexicographicalLCS', function () {
    const lcsOf = (s1: string | number[], s2: string | number[]): Array<[number, number]> =>
      findMinLexicographicalLCS(s1.length, s2.length, (x, y) => s1[x] === s2[y])

    expect(
      lcsOf('f8d1d155-d14e-433f-88e1-07b54f184740', 'a00322f7-256e-46fe-ae91-8de835c57778'),
    ).toEqual([
      [0, 6],
      [8, 8],
      [12, 12],
      [13, 13],
      [14, 14],
      [17, 16],
      [18, 18],
      [21, 20],
      [22, 22],
      [23, 23],
      [31, 24],
      [33, 32],
    ])

    expect(lcsOf('abcde', 'ace')).toEqual([
      [0, 0],
      [2, 1],
      [4, 2],
    ])
    expect(lcsOf('ace', 'abcde')).toEqual([
      [0, 0],
      [1, 2],
      [2, 4],
    ])
    expect(lcsOf('abc', 'abc')).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ])
    expect(lcsOf('abc', 'abce')).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
    ])
    expect(lcsOf('', 'abce')).toEqual([])
    expect(lcsOf('abce', '')).toEqual([])
    expect(lcsOf('', '')).toEqual([])
    expect(lcsOf([1, 2, 3, 4, 6, 6, 7, 8, 6], [2, 3, 4, 7, 9, 8, 2, 3, 5, 2])).toEqual([
      [1, 0],
      [2, 1],
      [3, 2],
      [6, 3],
      [7, 5],
    ])
    expect(lcsOf('abeep boop', 'beep boob blah')).toEqual([
      [1, 0],
      [2, 1],
      [3, 2],
      [4, 3],
      [5, 4],
      [6, 5],
      [7, 6],
      [8, 7],
    ])
    expect(lcsOf([1, 2, 3, 4], [2, 1, 2, 3, 4])).toEqual([
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ])
    expect(lcsOf([1, 2, 3, 4], [2, 3, 4, 1, 4])).toEqual([
      [1, 0],
      [2, 1],
      [3, 2],
    ])
    expect(lcsOf([1, 2, 3, 4], [2, 3, 1, 2, 3, 4])).toEqual([
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
    ])
    expect(lcsOf([1, 2, 3, 4], [2, 3, 1, 3, 1, 2, 3, 4])).toEqual([
      [0, 2],
      [1, 5],
      [2, 6],
      [3, 7],
    ])
    expect(lcsOf([1, 2, 3, 4], [2, 3, 1, 3, 1, 2, 3, 4, 3, 4])).toEqual([
      [0, 2],
      [1, 5],
      [2, 6],
      [3, 7],
    ])
    expect(lcsOf([2, 3, 1, 3, 1, 2, 3, 4], [1, 2, 3, 4])).toEqual([
      [2, 0],
      [5, 1],
      [6, 2],
      [7, 3],
    ])
  })

  it('findLCSOfEveryRightPrefix', function () {
    const dpOf = (s1: string | number[], s2: string | number[]): number[] | null =>
      findLCSOfEveryRightPrefix(s1.length, s2.length, (x, y) => s1[x] === s2[y])
    expect(
      dpOf('f8d1d155-d14e-433f-88e1-07b54f184740', 'a00322f7-256e-46fe-ae91-8de835c57778'),
    ).toEqual([
      0, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 6, 6, 7, 7, 8, 8, 8, 8, 9, 10, 11, 11, 11, 11, 11,
      11, 11, 11, 12, 12, 12, 12,
    ])
    expect(dpOf('abcde', 'ace')).toEqual([1, 2, 3])
    expect(dpOf('ace', 'abcde')).toEqual([1, 1, 2, 2, 3])
    expect(dpOf('abc', 'abc')).toEqual([1, 2, 3])
    expect(dpOf('abc', 'abce')).toEqual([1, 2, 3, 3])
    expect(dpOf('', 'abce')).toEqual(null)
    expect(dpOf('abce', '')).toEqual(null)
    expect(dpOf('', '')).toEqual(null)
    expect(dpOf([1, 2, 3, 4, 6, 6, 7, 8, 6], [2, 3, 4, 7, 9, 8, 2, 3, 5, 2])).toEqual([
      1, 2, 3, 4, 4, 5, 5, 5, 5, 5,
    ])
    expect(dpOf('abeep boop', 'beep boob blah')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8])
  })
})
