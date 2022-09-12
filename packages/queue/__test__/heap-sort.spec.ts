import {
  numberDataWithIndexCompare,
  stringDataWithIndexCompare,
} from '@@/fixtures/test-util/comparator'
import { TestDataType, TestDataTypeKey, loadTestData } from '@@/fixtures/test-util/data'
import { addSortTest } from '@@/fixtures/test-util/sort'
import type { IDataWithIndex } from '@@/fixtures/test-util/types'
import type { IPriorityQueue } from '../src'
import { PriorityQueue } from '../src'

const config = {
  stable: false,
}

describe('heap-sort', () => {
  addSortTest<number>({
    title: TestDataType.INTEGER,
    cases: [
      loadTestData(TestDataTypeKey.INTEGER_NON_NEGATIVE_UNIQUE),
      loadTestData(TestDataTypeKey.INTEGER_NON_NEGATIVE),
      loadTestData(TestDataTypeKey.INTEGER_NEGATIVE_UNIQUE),
      loadTestData(TestDataTypeKey.INTEGER_NEGATIVE),
      loadTestData(TestDataTypeKey.INTEGER_NEGATIVE_LOT),
    ],
    stable: config.stable,
    sort: createSort<number>(
      new PriorityQueue<IDataWithIndex<number>>({ compare: numberDataWithIndexCompare }),
    ),
  })

  addSortTest<number>({
    title: TestDataType.DECIMAL,
    cases: [
      loadTestData(TestDataTypeKey.DECIMAL_NON_NEGATIVE),
      loadTestData(TestDataTypeKey.DECIMAL_NEGATIVE),
      loadTestData(TestDataTypeKey.DECIMAL_NEGATIVE_LOT),
    ],
    stable: config.stable,
    sort: createSort<number>(
      new PriorityQueue<IDataWithIndex<number>>({ compare: numberDataWithIndexCompare }),
    ),
  })

  addSortTest<string>({
    title: TestDataType.STRING,
    cases: [
      loadTestData(TestDataTypeKey.STRING_FEW), //
      loadTestData(TestDataTypeKey.STRING_LOT),
    ],
    stable: config.stable,
    sort: createSort<string>(
      new PriorityQueue<IDataWithIndex<string>>({ compare: stringDataWithIndexCompare }),
    ),
  })

  function createSort<T>(
    queue: IPriorityQueue<IDataWithIndex<T>>,
  ): (elements: Array<IDataWithIndex<T>>, start?: number, end?: number) => void {
    return (elements: Array<IDataWithIndex<T>>, start = 0, end = elements.length): void => {
      // eslint-disable-next-line no-param-reassign
      if (start < 0) start = 0
      // eslint-disable-next-line no-param-reassign
      if (end > elements.length) end = elements.length
      if (start + 1 >= end) return

      queue.clear()
      queue.enqueues(elements, start, end)

      // eslint-disable-next-line no-param-reassign
      for (let i = start; i < end; ++i) elements[i] = queue.dequeue()!
    }
  }
})
