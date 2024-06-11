import type { IDiffItem, ILcsAlgorithm } from '../src'
import { DiffType, diff } from '../src'

function test_diff_string(
  lcs: ILcsAlgorithm | undefined,
  equals?: ((x: string, y: string) => boolean) | undefined,
): void {
  const test_case = (a: string, b: string, expected: number): void => {
    const actual: Array<IDiffItem<string>> = diff(a, b, { lcs, equals })
    const left: string = actual
      .filter(x => x.type !== DiffType.ADDED)
      .map(x => x.tokens)
      .join('')
    const right: string = actual
      .filter(x => x.type !== DiffType.REMOVED)
      .map(x => x.tokens)
      .join('')
    expect(left).toEqual(a)
    expect(right).toEqual(b)

    const common: string = actual
      .filter(x => x.type === DiffType.COMMON)
      .map(x => x.tokens)
      .join('')
    expect(common.length).toEqual(expected)

    let i: number = 0
    let j: number = 0
    for (; i < common.length && j < a.length; ++i, ++j) {
      while (i < common.length && j < a.length && common[i] !== a[j]) j += 1
    }
    expect(i).toEqual(common.length)
  }

  test_case('f8d1d155-d14e-433f-88e1-07b54f184740', 'a00322f7-256e-46fe-ae91-8de835c57778', 12)
  test_case('abcde', 'ace', 3)
  test_case('ace', 'abcde', 3)
  test_case('abc', 'abc', 3)
  test_case('abc', 'abce', 3)
  test_case('', 'abce', 0)
  test_case('abce', '', 0)
  test_case('', '', 0)
  test_case('123466786', '2347982352', 5)
  test_case('abeep boop', 'beep boob blah', 8)
  test_case('1234', '21234', 4)
  test_case('1234', '23414', 3)
  test_case('1234', '231234', 4)
  test_case('1234', '23131234', 4)
  test_case('1234', '2313123434', 4)
  test_case('23131234', '1234', 4)
}

describe('diff', () => {
  it('lcs_myers', async () => {
    test_diff_string('myers')

    const { lcs_myers } = await import('@algorithm.ts/lcs')
    test_diff_string(lcs_myers)
  })

  it('lcs_myers_linear_space', async () => {
    test_diff_string('myers_linear_space')

    const { lcs_myers_linear_space } = await import('@algorithm.ts/lcs')
    test_diff_string(lcs_myers_linear_space)
  })

  it('lcs_dp', async () => {
    test_diff_string('dp')

    const { lcs_dp } = await import('@algorithm.ts/lcs')
    test_diff_string(lcs_dp)
  })

  it('default', async () => {
    test_diff_string(undefined)
    test_diff_string(undefined, (x, y) => x === y)
  })
})
