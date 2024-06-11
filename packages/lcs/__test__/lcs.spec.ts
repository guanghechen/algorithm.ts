import {
  findLCSOfEveryRightPrefix,
  lcs_dp,
  lcs_myers,
  lcs_myers_linear_space,
  lcs_size_dp,
  lcs_size_myers,
  lcs_size_myers_linear_space,
} from '../src'

type ILcsSize = (N1: number, N2: number, equals: (x: number, y: number) => boolean) => number
type ILcs = (
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
) => Array<[number, number]>

function test_lcs_size(lcs_size: ILcsSize): void {
  const test_case = <T extends string | unknown[]>(s1: T, s2: T, expected: number): void => {
    const actual: number = lcs_size(s1.length, s2.length, (x, y) => s1[x] === s2[y])
    expect(actual).toEqual(expected)
  }

  test_case('f8d1d155-d14e-433f-88e1-07b54f184740', 'a00322f7-256e-46fe-ae91-8de835c57778', 12)
  test_case('abcde', 'ace', 3)
  test_case('ace', 'abcde', 3)
  test_case('abc', 'abc', 3)
  test_case('abc', 'abce', 3)
  test_case('', 'abce', 0)
  test_case('abce', '', 0)
  test_case('', '', 0)
  test_case([1, 2, 3, 4, 6, 6, 7, 8, 6], [2, 3, 4, 7, 9, 8, 2, 3, 5, 2], 5)
  test_case('abeep boop', 'beep boob blah', 8)
}

function test_lcs(lcs: ILcs): void {
  const test_case = <T extends string | unknown[]>(s1: T, s2: T, expected: number): void => {
    const result = lcs(s1.length, s2.length, (x, y) => s1[x] === s2[y]).map(([i]) => s1[i])
    const actual: T = typeof s1 === 'string' ? (result.join('') as T) : (result as T)
    expect(actual.length).toEqual(expected)

    let k: number = 0
    for (let i: number = 0; i < s1.length && k < actual.length; ++i) if (s1[i] === actual[k]) k += 1
    expect(k).toEqual(actual.length)

    k = 0
    for (let i: number = 0; i < s2.length && k < actual.length; ++i) if (s2[i] === actual[k]) k += 1
    expect(k).toEqual(actual.length)
  }

  test_case('f8d1d155-d14e-433f-88e1-07b54f184740', 'a00322f7-256e-46fe-ae91-8de835c57778', 12)
  test_case('abcde', 'ace', 3)
  test_case('ace', 'abcde', 3)
  test_case('abc', 'abc', 3)
  test_case('abc', 'abce', 3)
  test_case('', 'abce', 0)
  test_case('abce', '', 0)
  test_case('', '', 0)
  test_case([1, 2, 3, 4, 6, 6, 7, 8, 6], [2, 3, 4, 7, 9, 8, 2, 3, 5, 2], 5)
  test_case('abeep boop', 'beep boob blah', 8)
  test_case([1, 2, 3, 4], [2, 1, 2, 3, 4], 4)
  test_case([1, 2, 3, 4], [2, 3, 4, 1, 4], 3)
  test_case([1, 2, 3, 4], [2, 3, 1, 2, 3, 4], 4)
  test_case([1, 2, 3, 4], [2, 3, 1, 3, 1, 2, 3, 4], 4)
  test_case([1, 2, 3, 4], [2, 3, 1, 3, 1, 2, 3, 4, 3, 4], 4)
  test_case([2, 3, 1, 3, 1, 2, 3, 4], [1, 2, 3, 4], 4)
}

function test_lcs_minimal_lexicographical(lcs: ILcs): void {
  const test_case = <T extends string | unknown[]>(
    s1: T,
    s2: T,
    expected: Array<[number, number]>,
  ): void => {
    const actual: Array<[number, number]> = lcs(s1.length, s2.length, (x, y) => s1[x] === s2[y])
    expect(actual).toEqual(expected)
  }

  test_case('f8d1d155-d14e-433f-88e1-07b54f184740', 'a00322f7-256e-46fe-ae91-8de835c57778', [
    [0, 6],
    [6, 10],
    [12, 12],
    [13, 13],
    [14, 14],
    [17, 16],
    [18, 18],
    [21, 20],
    [22, 22],
    [23, 23],
    [25, 32],
    [31, 35],
  ])
  test_case('abcde', 'ace', [
    [0, 0],
    [2, 1],
    [4, 2],
  ])
  test_case('ace', 'abcde', [
    [0, 0],
    [1, 2],
    [2, 4],
  ])
  test_case('abc', 'abc', [
    [0, 0],
    [1, 1],
    [2, 2],
  ])
  test_case('abc', 'abce', [
    [0, 0],
    [1, 1],
    [2, 2],
  ])
  test_case('', 'abce', [])
  test_case('abce', '', [])
  test_case('', '', [])
  test_case(
    [1, 2, 3, 4, 6, 6, 7, 8, 6],
    [2, 3, 4, 7, 9, 8, 2, 3, 5, 2],
    [
      [1, 0],
      [2, 1],
      [3, 2],
      [6, 3],
      [7, 5],
    ],
  )
  test_case('abeep boop', 'beep boob blah', [
    [1, 0],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 4],
    [6, 5],
    [7, 6],
    [8, 7],
  ])
  test_case(
    [1, 2, 3, 4],
    [2, 1, 2, 3, 4],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  )
  test_case(
    [1, 2, 3, 4],
    [2, 3, 4, 1, 4],
    [
      [1, 0],
      [2, 1],
      [3, 2],
    ],
  )
  test_case(
    [1, 2, 3, 4],
    [2, 3, 1, 2, 3, 4],
    [
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
    ],
  )
  test_case(
    [1, 2, 3, 4],
    [2, 3, 1, 3, 1, 2, 3, 4],
    [
      [0, 2],
      [1, 5],
      [2, 6],
      [3, 7],
    ],
  )
  test_case(
    [1, 2, 3, 4],
    [2, 3, 1, 3, 1, 2, 3, 4, 3, 4],
    [
      [0, 2],
      [1, 5],
      [2, 6],
      [3, 7],
    ],
  )
  test_case(
    [2, 3, 1, 3, 1, 2, 3, 4],
    [1, 2, 3, 4],
    [
      [2, 0],
      [5, 1],
      [6, 2],
      [7, 3],
    ],
  )
}

describe('lcs size', function () {
  it('dp', () => {
    test_lcs_size(lcs_size_dp)
  })

  it('myers', () => {
    test_lcs_size(lcs_size_myers)
  })

  it('myers (linear space)', () => {
    test_lcs_size(lcs_size_myers_linear_space)
  })
})

describe('lcs', function () {
  it('dp', () => {
    test_lcs(lcs_dp)
  })

  it('myers', () => {
    test_lcs(lcs_myers)
  })

  it('myers (linear space)', () => {
    test_lcs(lcs_myers_linear_space)
  })
})

describe('lcs (minimal lexicographical)', () => {
  it('dp', () => {
    test_lcs_minimal_lexicographical(lcs_dp)
  })

  it('myers', () => {
    // test_lcs_minimal_lexicographical(lcs_myers)
  })

  it('myers (linear space)', () => {
    // test_lcs_minimal_lexicographical(lcs_myers_linear_space)
  })
})

describe('others', () => {
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
