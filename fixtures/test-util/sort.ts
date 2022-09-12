import type { IDataWithIndex } from './types'
import { createDebugInfo } from './util'

export interface ISortTestCase<T = unknown> {
  title: string
  data: T[][] | Promise<T[][]>
}

export interface ISortTestCaseGroup<T = unknown> {
  title: string
  cases: Array<ISortTestCase<T>>
  stable: boolean
  sort(elements: Array<IDataWithIndex<T>>, start: number | undefined, end: number | undefined): void
}

export function addSortTest<T = unknown>(caseGroup: ISortTestCaseGroup<T>): void {
  const { cases, stable, sort } = caseGroup
  describe(caseGroup.title, function () {
    for (const { title, data } of cases) {
      describe(title, function () {
        let runs: Array<() => void>
        let checks: Array<() => void>

        beforeAll(async () => {
          runs = []
          checks = []
          const inputs: T[][] = await data
          for (let caseNo = 0; caseNo < inputs.length; ++caseNo) {
            const context = { caseNo, stable }
            const input: Array<IDataWithIndex<T>> = inputs[caseNo].map((value, index) => ({
              index,
              value,
            }))

            {
              const { run, check } = testRangeSort<T>(input, sort, { ...context })
              runs.push(run)
              checks.push(check)
            }

            {
              const { run, check } = testRangeSort<T>(input, sort, {
                ...context,
                start: -1,
                end: 9,
              })
              runs.push(run)
              checks.push(check)
            }

            {
              const { run, check } = testRangeSort<T>(input, sort, {
                ...context,
                start: 1,
                end: input.length - 7,
              })
              runs.push(run)
              checks.push(check)
            }
          }
        })

        test('run', async () => {
          runs.forEach(run => run())
        })

        test('check', async () => {
          checks.forEach(check => check())
        })
      })
    }
  })
}

function testRangeSort<T = unknown>(
  input: Array<IDataWithIndex<T>>,
  sort: (elements: Array<IDataWithIndex<T>>, start?: number, end?: number) => void,
  context: {
    caseNo: number
    stable: boolean
    start?: number
    end?: number
  },
): { run(): void; check(): void } {
  const N: number = input.length
  const { caseNo, stable, start: start0 = 0, end: end0 = input.length } = context
  const elements: Array<IDataWithIndex<T>> = input.slice()
  const dataSet: Set<IDataWithIndex<T>> = new Set(elements)
  const idSet: Set<number> = new Set<number>(new Array(N).fill(0).map((_x, i) => i))
  return { run, check }

  function run(): void {
    sort(elements, context.start, context.end)
  }

  function check(): void {
    const debugInfo = createDebugInfo(caseNo, stable, start0, end0)
    expect([debugInfo, elements.length]).toEqual([debugInfo, N])

    for (const data of elements) {
      if (!dataSet.has(data)) break
      if (!idSet.has(data.index)) break
      if (data.value !== input[data.index].value) break

      dataSet.delete(data)
      idSet.delete(data.index)
    }
    expect([debugInfo, dataSet.size]).toEqual([debugInfo, 0])
    expect([debugInfo, idSet.size]).toEqual([debugInfo, 0])

    const start = Math.max(0, start0)
    const end = Math.min(elements.length, end0)
    if (start + 1 >= end) {
      expect(elements).toEqual(input)
    } else {
      try {
        if (stable) {
          let i = start + 1
          for (let x = elements[start]; i < end; ++i) {
            const y = elements[i]
            if (x.value > y.value || (x.value === y.value && x.index >= y.index)) break
            x = y
          }
          expect([debugInfo, i]).toEqual([debugInfo, end])
        } else {
          let i = start + 1
          for (let x = elements[start]; i < end; ++i) {
            const y = elements[i]
            if (x.value > y.value) break
            x = y
          }
          expect([debugInfo, i]).toEqual([debugInfo, end])
        }

        // unchanged.
        expect(elements.slice(0, start)).toEqual(input.slice(0, start))
        expect(elements.slice(end)).toEqual(input.slice(end))
      } catch (error) {
        console.error('elements:', elements)
        throw error
      }
    }
  }
}
