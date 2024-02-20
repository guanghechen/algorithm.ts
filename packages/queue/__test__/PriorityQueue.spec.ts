import { numberCompare } from '@@/fixtures/test-util/comparator'
import { PriorityQueue } from '../src'

class MyPriorityQueue<T> extends PriorityQueue<T> {
  public collect(): T[] {
    return this._elements.slice(1, this._size + 1)
  }
}

describe('PriorityQueue', function () {
  const N = 1000

  it('iterator', function () {
    const Q = new MyPriorityQueue<number>({ compare: (x, y) => y - x })
    Q.enqueues([2, 3, 4, 5, 1, 2, 3, 4, 9, 5, 9])
    expect(Array.from(Q)).toEqual(Q.collect())
  })

  it('init - 1', function () {
    for (let n = N; n <= N + 20; ++n) {
      const randomValues: number[] = new Array(n)
      for (let i = 0; i < n; ++i) randomValues[i] = Math.random()

      let compareCnt = 0
      const Q = new MyPriorityQueue<number>({
        compare: (x, y) => {
          compareCnt += 1
          return y - x
        },
      })

      const bakRandomValues: number[] = randomValues.slice()
      Q.init(randomValues)

      expect(randomValues).toEqual(bakRandomValues)
      expect(compareCnt).toBeLessThanOrEqual(n << 2)

      const output: number[] = []
      while (Q.size > 0) output.push(Q.dequeue()!)

      const answer: number[] = randomValues.slice().sort((x, y) => y - x)
      expect(output).toEqual(answer)
    }
  })

  it('init - 2', function () {
    for (let n = N; n <= N + 20; ++n) {
      const randomValues: number[] = new Array(n)
      for (let i = 0; i < n; ++i) randomValues[i] = Math.random()

      let compareCnt = 0
      const Q = new MyPriorityQueue<number>({
        compare: (x, y) => {
          compareCnt += 1
          return y - x
        },
      })

      const bakRandomValues: number[] = randomValues.slice()
      Q.init(randomValues, 3, N)

      expect(randomValues).toEqual(bakRandomValues)
      expect(compareCnt).toBeLessThanOrEqual((N - 3) << 2)

      const output: number[] = []
      while (Q.size > 0) output.push(Q.dequeue()!)

      const answer: number[] = randomValues.slice(3, N).sort((x, y) => y - x)
      expect(output).toEqual(answer)
    }
  })

  it('enqueues', function () {
    const Q = new MyPriorityQueue<number>({ compare: (x, y) => y - x })
    Q.enqueue(2)
    expect(Q.size).toEqual(1)
    expect(Q.front()).toEqual(2)
    Q.enqueues([])
    expect(Q.size).toEqual(1)
    expect(Q.front()).toEqual(2)
    Q.enqueues([2.3])
    expect(Q.size).toEqual(2)
    expect(Q.front()).toEqual(2.3)
    Q.enqueues([3, 4, 2])
    expect(Q.size).toEqual(5)
    expect(Q.front()).toEqual(4)
    expect(Q.dequeue()).toEqual(4)
    expect(Q.dequeue()).toEqual(3)
    expect(Q.dequeue()).toEqual(2.3)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.dequeue()).toEqual(undefined)
    expect(Q.size).toEqual(0)

    Q.enqueues([3, 2, 6], 1, 2)
    expect(Q.size).toEqual(1)
    expect(Q.front()).toEqual(2)
    Q.enqueues([7, 8, 9], undefined, 2)
    expect(Q.size).toEqual(3)
    expect(Q.front()).toEqual(8)
    Q.enqueues([12, 11, 10], -1)
    expect(Q.size).toEqual(6)
    expect(Q.front()).toEqual(12)
    Q.enqueues([13, 14, 15], 0)
    expect(Q.size).toEqual(9)
    expect(Q.front()).toEqual(15)
    Q.enqueues([16])
    expect(Q.front()).toEqual(16)
    Q.dequeue()
    expect(Q.front()).toEqual(15)
  })

  it('splice', function () {
    const Q = new MyPriorityQueue<number>({ compare: (x, y) => y - x })

    const initialElements: number[] = [1, 3, 7, 8, 9, 2, 3, 4, -2, -7, -4, 11]
    const filter1 = (x: number): boolean => x > 0 && x < 10
    const filter2 = (x: number): boolean => x > 7

    Q.init(initialElements)
    expect(Q.size).toEqual(initialElements.length)

    expect(Q.collect().sort()).toEqual(initialElements.slice().sort())
    Q.splice(filter1)
    expect(Q.collect().sort()).toEqual(initialElements.filter(filter1).sort())

    const newElements = [-2, 8, 9]
    Q.splice(filter2, newElements)
    expect(Q.collect().sort()).toEqual(
      initialElements.filter(filter1).filter(filter2).concat(newElements).sort(),
    )

    Q.splice(() => false)
    expect(Q.size).toEqual(0)
    expect(Q.front()).toEqual(undefined)
    expect(Q.dequeue()).toEqual(undefined)

    Q.splice(() => true, [1, 2, 3])
    expect(Q.size).toEqual(3)
    expect(Q.front()).toEqual(3)
    expect(Q.dequeue()).toEqual(3)
    expect(Q.collect().sort()).toEqual([1, 2])
  })

  it('replaceTop', function () {
    const Q = new MyPriorityQueue<number>({ compare: (x, y) => y - x })

    Q.init([3, 2, 4, -2, -1, 0])
    expect(Q.front()).toEqual(4)
    expect(Q.size).toEqual(6)
    expect(
      Q.collect()
        .slice()
        .sort((x, y) => x - y),
    ).toEqual([-2, -1, 0, 2, 3, 4])

    Q.dequeue(7)
    expect(Q.front()).toEqual(7)
    expect(Q.size).toEqual(6)
    expect(
      Q.collect()
        .slice()
        .sort((x, y) => x - y),
    ).toEqual([-2, -1, 0, 2, 3, 7])

    Q.dequeue(2)
    expect(Q.front()).toEqual(3)
    expect(Q.size).toEqual(6)
    expect(
      Q.collect()
        .slice()
        .sort((x, y) => x - y),
    ).toEqual([-2, -1, 0, 2, 2, 3])

    Q.dequeue(4)
    expect(Q.front()).toEqual(4)
    expect(Q.size).toEqual(6)
    expect(
      Q.collect()
        .slice()
        .sort((x, y) => x - y),
    ).toEqual([-2, -1, 0, 2, 2, 4])
  })

  it('front', function () {
    const Q = new MyPriorityQueue<number>({ compare: (x, y) => y - x })
    const randomValues: number[] = new Array(N)
    for (let i = 0; i < N; ++i) {
      randomValues[i] = Math.random()
    }

    const maximum = randomValues.reduce((acc, x) => Math.max(acc, x), Number.MIN_SAFE_INTEGER)

    for (let i = 0; i < N; ++i) Q.enqueue(randomValues[i])
    for (let i = 0; i <= N; ++i) {
      expect(Q.front()).toEqual(maximum)
      expect(Q.size).toEqual(N)
    }
  })

  it('clear', function () {
    const Q = new MyPriorityQueue<number>({ compare: numberCompare })
    Q.init()
    expect(Q.size).toEqual(0)
    expect(Q.size <= 0).toEqual(true)

    Q.enqueues([1, 2, 3, 4])
    expect(Q.size).toEqual(4)
    expect(Q.size <= 0).toEqual(false)

    Q.clear()
    expect(Q.size).toEqual(0)
    expect(Q.size <= 0).toEqual(true)
  })

  it('destroy', function () {
    const Q = new MyPriorityQueue<number>({ compare: numberCompare })
    Q.init([1, 2, 3, 4, 5])
    expect(Q.size).toEqual(5)

    Q.destroy()
    expect(Q.size).toEqual(0)
    expect(() => Q.enqueue(0)).toThrow(/Cannot set properties of null/)
  })

  it('edge case', function () {
    const Q = new MyPriorityQueue<number>({ compare: (x, y) => y - x })
    Q.init()
    Q.enqueue(0)
    Q.enqueue(2)

    expect(Q.size).toEqual(2)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.size).toEqual(1)
    expect(Q.dequeue()).toEqual(0)
    expect(Q.size).toEqual(0)
    expect(Q.dequeue()).toEqual(undefined)
    expect(Q.size).toEqual(0)

    Q.init(undefined, 0, 1)
    expect(Q.size).toEqual(0)

    Q.enqueues([1, 2, 3, 4, 5, 6])
    expect(Q.size).toEqual(6)
    expect(Q.front()).toEqual(6)

    Q.init(undefined)
    expect(Q.size).toEqual(0)
    Q.dequeue(2)
    expect(Q.size).toEqual(1)
    expect(Q.front()).toEqual(2)
    Q.dequeue(1)
    expect(Q.size).toEqual(1)
    expect(Q.front()).toEqual(1)

    Q.clear()
    Q.enqueues([1, 2, 3], -1, 7)
    expect(Q.size).toEqual(3)
  })
})
