import { stringOrNumberCompare } from '@@/fixtures/test-util/comparator'
import { TestDataType, TestDataTypeKey, loadTestData } from '@@/fixtures/test-util/data'
import { createDebugInfo } from '@@/fixtures/test-util/util'
import type { ICompare } from '@algorithm.ts/internal'
import { SlidingWindow } from '../src'

const caseGroups = [
  {
    title: TestDataType.INTEGER,
    cases: [
      loadTestData(TestDataTypeKey.INTEGER_NON_NEGATIVE_UNIQUE),
      loadTestData(TestDataTypeKey.INTEGER_NON_NEGATIVE),
      loadTestData(TestDataTypeKey.INTEGER_NEGATIVE_UNIQUE),
      loadTestData(TestDataTypeKey.INTEGER_NEGATIVE),
      loadTestData(TestDataTypeKey.INTEGER_NEGATIVE_LOT),
    ],
  },
  {
    title: TestDataType.DECIMAL,
    cases: [
      loadTestData(TestDataTypeKey.DECIMAL_NON_NEGATIVE),
      loadTestData(TestDataTypeKey.DECIMAL_NEGATIVE),
      loadTestData(TestDataTypeKey.DECIMAL_NEGATIVE_LOT),
    ],
  },
  {
    title: TestDataType.STRING,
    cases: [
      loadTestData(TestDataTypeKey.STRING_FEW), //
      loadTestData(TestDataTypeKey.STRING_LOT),
    ],
  },
] as const

describe('basic', function () {
  test('simple', function () {
    //                          0  1  2  3  4  5  6  7  8
    const elements: number[] = [1, 9, 3, 5, 4, 7, 6, 8, 2]
    const f = (idx: number | undefined): number | undefined =>
      idx === undefined ? undefined : elements[idx]
    const min = (): number | undefined => f(slidingWindow.min())

    const slidingWindow = new SlidingWindow({
      WINDOW_SIZE: 3,
      compare: (idx: number, idy: number) => f(idx)! - f(idy)!,
    })

    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary(-1)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary(0)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(1)

    slidingWindow.forwardRightBoundary(2)
    expect(min()).toEqual(1)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(3)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(3)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(4)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(4)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(6)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(2)

    slidingWindow.reset({ startIndex: 1, WINDOW_SIZE: 2 })
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(9)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(3)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(3)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(4)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(4)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(6)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(6)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(2)

    slidingWindow.reset()
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(1)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(1)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(3)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(3)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(4)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(4)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(6)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(6)

    slidingWindow.forwardRightBoundary()
    expect(min()).toEqual(2)
  })

  test('peristalsisUntil', function () {
    //                          0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
    const elements: number[] = [4, 2, 9, 9, 4, 1, 6, 6, 0, 2, 3, 4, 1, 5, 1, 7, 4, 6, 0, 4]
    const f = (idx: number | undefined): number | undefined =>
      idx === undefined ? undefined : elements[idx]
    const min = (): number | undefined => f(slidingWindow.min())

    const slidingWindow = new SlidingWindow({
      WINDOW_SIZE: 3,
      compare: (idx: number, idy: number) => f(idx)! - f(idy)!,
    })

    expect(min()).toEqual(undefined) // [0, 0)

    slidingWindow.forwardRightBoundary() // [0, 1)
    expect(min()).toEqual(4)

    slidingWindow.forwardRightBoundary() // [0, 2)
    expect(min()).toEqual(2)

    slidingWindow.forwardRightBoundary() // [0, 3)
    expect(min()).toEqual(2)

    slidingWindow.forwardLeftBoundary() // [1, 3)
    expect(min()).toEqual(2)

    slidingWindow.forwardLeftBoundary() // [2, 3)
    expect(min()).toEqual(9)

    slidingWindow.forwardRightBoundary() // [2, 4)
    expect(min()).toEqual(9)

    slidingWindow.forwardRightBoundary() // [2, 5)
    expect(min()).toEqual(4)

    slidingWindow.forwardRightBoundary() // [3, 6)
    expect(min()).toEqual(1)

    slidingWindow.forwardRightBoundary() // [4, 7)
    expect(min()).toEqual(1)

    slidingWindow.forwardLeftBoundary(2) // [6, 7)
    expect(min()).toEqual(6)

    slidingWindow.forwardRightBoundary() // [6, 8)
    expect(min()).toEqual(6)

    slidingWindow.forwardLeftBoundary() // [7, 8)
    expect(min()).toEqual(6)

    slidingWindow.forwardLeftBoundary(0) // [7, 8)
    expect(min()).toEqual(6)

    slidingWindow.forwardLeftBoundary(-1) // [7, 8)
    expect(min()).toEqual(6)

    slidingWindow.forwardLeftBoundary(2) // [9, 8)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary() // [9, 9)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary() // [9, 10)
    expect(min()).toEqual(2)

    slidingWindow.forwardRightBoundary() // [9, 11)
    expect(min()).toEqual(2)

    slidingWindow.forwardRightBoundary() // [9, 12)
    expect(min()).toEqual(2)

    slidingWindow.forwardRightBoundary() // [10, 13)
    expect(min()).toEqual(1)

    slidingWindow.forwardRightBoundary() // [11, 14)
    expect(min()).toEqual(1)

    slidingWindow.forwardLeftBoundary(2) // [13, 14)
    expect(min()).toEqual(5)

    slidingWindow.forwardRightBoundary() // [13, 15)
    expect(min()).toEqual(1)

    slidingWindow.forwardLeftBoundary(5) // [18, 15)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardLeftBoundary(0) // [18, 15)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardLeftBoundary(-1) // [18, 15)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary() // [18, 16)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary() // [18, 17)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary() // [18, 18)
    expect(min()).toEqual(undefined)

    slidingWindow.forwardRightBoundary() // [18, 19)
    expect(min()).toEqual(0)

    slidingWindow.forwardRightBoundary() // [18, 20)
    expect(min()).toEqual(0)
  })

  describe('basic', function () {
    for (const caseGroup of caseGroups) {
      describe(`${caseGroup.title}`, function () {
        for (const { title, data } of caseGroup.cases) {
          test(`${title}`, async () => {
            const inputs = await data
            for (let caseNo = 0; caseNo < inputs.length; ++caseNo) {
              const input = inputs[caseNo]
              const WINDOW_SIZE = 7
              const compare: ICompare<number> = (idx, idy) => {
                const x = input[idx]
                const y = input[idy]
                return stringOrNumberCompare(x, y)
              }
              const slidingWindow = new SlidingWindow({ WINDOW_SIZE, compare })

              let failedCount = 0
              for (let i = 0; i < input.length; ++i) {
                slidingWindow.forwardRightBoundary()
                let answer = i - WINDOW_SIZE + 1
                if (answer < 0) answer = 0
                for (let j = answer + 1; j <= i; ++j) {
                  if (compare(answer, j) >= 0) answer = j
                }
                if (answer !== slidingWindow.min()) failedCount += 1
              }
              const debugInfo = createDebugInfo(caseNo)
              expect([debugInfo, failedCount]).toEqual([debugInfo, 0])
            }
          })
        }
      })
    }
  })
})
