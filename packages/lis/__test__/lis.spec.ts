import { stringOrNumberCompare } from '@@/fixtures/test-util/comparator'
import { TestDataType, TestDataTypeKey, loadTestData } from '@@/fixtures/test-util/data'
import { createDebugInfo } from '@@/fixtures/test-util/util'
import type { ICompare } from '@algorithm.ts/internal'
import { findLengthOfLIS, findMinLexicographicalLIS } from '@algorithm.ts/lis'

const caseGroups = [
  {
    title: TestDataType.INTEGER,
    cases: [
      loadTestData(TestDataTypeKey.INTEGER_NON_NEGATIVE_UNIQUE),
      loadTestData(TestDataTypeKey.INTEGER_NON_NEGATIVE),
      loadTestData(TestDataTypeKey.INTEGER_NEGATIVE_UNIQUE),
      loadTestData(TestDataTypeKey.INTEGER_NEGATIVE),
      // loadTestData(TestDataTypeKey.INTEGER_NEGATIVE_LOT),
    ],
  },
  {
    title: TestDataType.DECIMAL,
    cases: [
      loadTestData(TestDataTypeKey.DECIMAL_NON_NEGATIVE),
      loadTestData(TestDataTypeKey.DECIMAL_NEGATIVE),
      // loadTestData(TestDataTypeKey.DECIMAL_NEGATIVE_LOT),
    ],
  },
  {
    title: TestDataType.STRING,
    cases: [
      loadTestData(TestDataTypeKey.STRING_FEW), //
      // loadTestData(TestDataTypeKey.STRING_LOT),
    ],
  },
] as const

describe('findLengthOfLIS', () => {
  for (const caseGroup of caseGroups) {
    describe(`${caseGroup.title}`, function () {
      for (const { title, data } of caseGroup.cases) {
        test(`${title}`, async () => {
          const inputs = await data
          for (let caseNo = 0; caseNo < inputs.length; ++caseNo) {
            const input = inputs[caseNo]
            const answer = _findFirstLIS<number | string>(input, stringOrNumberCompare).length
            const output = findLengthOfLIS(input.length, (i, j) =>
              stringOrNumberCompare(input[i], input[j]),
            )

            const debugInfo = createDebugInfo(caseNo)
            expect([debugInfo, output]).toEqual([debugInfo, answer])
          }
        })
      }
    })
  }
})

describe('findMinLexicographicalLIS', () => {
  for (const caseGroup of caseGroups) {
    describe(`${caseGroup.title}`, function () {
      for (const { title, data } of caseGroup.cases) {
        test(`${title}`, async () => {
          const inputs = await data
          for (let caseNo = 0; caseNo < inputs.length; ++caseNo) {
            const input = inputs[caseNo]
            const answer = _findFirstLIS<number | string>(input, stringOrNumberCompare)
            const output = findMinLexicographicalLIS(input.length, (i, j) =>
              stringOrNumberCompare(input[i], input[j]),
            )

            const debugInfo = createDebugInfo(caseNo)
            expect([debugInfo, output]).toEqual([debugInfo, answer])
          }
        })
      }
    })
  }
})

function _findFirstLIS<T>(data: T[], compare: ICompare<T>): number[] {
  if (data.length <= 0) return []
  if (data.length === 1) return [0]

  const N = data.length
  const dp: number[] = new Array(N).fill(0)
  const pa: number[] = new Array(N).fill(-1)
  for (let i = 0; i < N; ++i) {
    let answer = 0
    for (let j = 0; j < i; ++j) {
      if (compare(data[j], data[i]) < 0 && answer < dp[j]) {
        answer = dp[j]
        pa[i] = j
      }
    }
    dp[i] = answer + 1
  }

  const maxLen = Math.max(...dp)
  let i = 0
  for (; i < N; ++i) {
    if (dp[i] === maxLen) break
  }

  const results: number[] = []
  for (; i >= 0; i = pa[i]) results.push(i)
  return results.reverse()
}
