import { calcDpOfLCS, findLengthOfLCS, findMinLexicographicalLCS } from '../src'

describe('basic', function () {
  test('findLengthOfLCS', function () {
    const lenOf = (s1: string | number[], s2: string | number[]): number =>
      findLengthOfLCS(s1.length, s2.length, (x, y) => s1[x] === s2[y])

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

  test('findMinLexicographicalLCS', function () {
    const lcsOf = (s1: string | number[], s2: string | number[]): number[] =>
      findMinLexicographicalLCS(s1.length, s2.length, (x, y) => s1[x] === s2[y])

    expect(lcsOf('abcde', 'ace')).toEqual([0, 2, 4])
    expect(lcsOf('ace', 'abcde')).toEqual([0, -1, 1, -1, 2])
    expect(lcsOf('abc', 'abc')).toEqual([0, 1, 2])
    expect(lcsOf('abc', 'abce')).toEqual([0, 1, 2, -1])
    expect(lcsOf('', 'abce')).toEqual([-1, -1, -1, -1])
    expect(lcsOf('abce', '')).toEqual([])
    expect(lcsOf('', '')).toEqual([])
    expect(lcsOf([1, 2, 3, 4, 6, 6, 7, 8, 6], [2, 3, 4, 7, 9, 8, 2, 3, 5, 2])).toEqual([
      1, 2, 3, 6, -1, 7, -1, -1, -1, -1,
    ])
    expect(lcsOf('abeep boop', 'beep boob blah')).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, -1, -1, -1, -1, -1, -1,
    ])
  })

  test('testDpOfLCS', function () {
    const dpOf = (s1: string | number[], s2: string | number[]): number[][] =>
      calcDpOfLCS(s1.length, s2.length, (x, y) => s1[x] === s2[y])
    expect(dpOf('abcde', 'ace')).toEqual([
      [1, 1, 1],
      [1, 1, 1],
      [1, 2, 2],
      [1, 2, 2],
      [1, 2, 3],
    ])
    expect(dpOf('ace', 'abcde')).toEqual([
      [1, 1, 1, 1, 1],
      [1, 1, 2, 2, 2],
      [1, 1, 2, 2, 3],
    ])
    expect(dpOf('abc', 'abc')).toEqual([
      [1, 1, 1],
      [1, 2, 2],
      [1, 2, 3],
    ])
    expect(dpOf('abc', 'abce')).toEqual([
      [1, 1, 1, 1],
      [1, 2, 2, 2],
      [1, 2, 3, 3],
    ])
    expect(dpOf('', 'abce')).toEqual([])
    expect(dpOf('abce', '')).toEqual([])
    expect(dpOf('', '')).toEqual([])
    expect(dpOf([1, 2, 3, 4, 6, 6, 7, 8, 6], [2, 3, 4, 7, 9, 8, 2, 3, 5, 2])).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [1, 2, 3, 3, 3, 3, 3, 3, 3, 3],
      [1, 2, 3, 3, 3, 3, 3, 3, 3, 3],
      [1, 2, 3, 3, 3, 3, 3, 3, 3, 3],
      [1, 2, 3, 4, 4, 4, 4, 4, 4, 4],
      [1, 2, 3, 4, 4, 5, 5, 5, 5, 5],
      [1, 2, 3, 4, 4, 5, 5, 5, 5, 5],
    ])
    expect(dpOf('abeep boop', 'beep boob blah')).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      [1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7],
      [1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8],
      [1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8],
    ])
  })
})
