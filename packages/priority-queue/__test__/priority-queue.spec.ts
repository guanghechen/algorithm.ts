import { createPriorityQueue } from '../src'

describe('basic', function () {
  const N = 1000

  test('min', function () {
    const Q = createPriorityQueue<number>((x, y) => y - x)
    const randomValues: number[] = new Array(N)
    for (let i = 0; i < N; ++i) {
      randomValues[i] = Math.random()
    }

    const output: number[] = []
    for (let i = 0; i < N; ++i) Q.enqueue(randomValues[i])
    while (!Q.isEmpty()) output.push(Q.dequeue()!)

    expect(Q.isEmpty()).toBe(true)
    expect(Q.top()).toBeUndefined()
    expect(Q.dequeue()).toBeUndefined()

    const answer: number[] = randomValues.slice().sort((x, y) => x - y)
    expect(output).toEqual(answer)
  })

  test('max', function () {
    const Q = createPriorityQueue<number>((x, y) => x - y)
    const randomValues: number[] = new Array(N)
    for (let i = 0; i < N; ++i) {
      randomValues[i] = Math.random()
    }

    const output: number[] = []
    for (let i = 0; i < N; ++i) Q.enqueue(randomValues[i])
    while (!Q.isEmpty()) output.push(Q.dequeue()!)

    expect(Q.isEmpty()).toBe(true)
    expect(Q.top()).toBeUndefined()
    expect(Q.dequeue()).toBeUndefined()

    const answer: number[] = randomValues.slice().sort((x, y) => y - x)
    expect(output).toEqual(answer)
  })

  test('top', function () {
    const Q = createPriorityQueue<number>((x, y) => x - y)
    const randomValues: number[] = new Array(N)
    for (let i = 0; i < N; ++i) {
      randomValues[i] = Math.random()
    }

    const maximum = randomValues.reduce((acc, x) => Math.max(acc, x), Number.MIN_SAFE_INTEGER)

    for (let i = 0; i < N; ++i) Q.enqueue(randomValues[i])
    for (let i = 0; i <= N; ++i) {
      expect(Q.top()).toEqual(maximum)
      expect(Q.size()).toEqual(N)
    }
  })

  test('collect', function () {
    const Q = createPriorityQueue<number>((x, y) => x - y)
    const randomValues: number[] = new Array(N)
    for (let i = 0; i < N; ++i) {
      randomValues[i] = Math.random()
    }

    for (let i = 0; i < N; ++i) Q.enqueue(randomValues[i])
    expect(Q.collect().sort((x, y) => x - y)).toEqual(randomValues.slice().sort((x, y) => x - y))
  })

  test('init - 1', function () {
    for (let n = N; n <= N + 20; ++n) {
      const randomValues: number[] = new Array(n)
      for (let i = 0; i < n; ++i) randomValues[i] = Math.random()

      let compareCnt = 0
      const Q = createPriorityQueue<number>((x, y) => {
        compareCnt += 1
        return x - y
      })

      const bakRandomValues: number[] = randomValues.slice()
      Q.init(randomValues)

      expect(randomValues).toEqual(bakRandomValues)
      expect(compareCnt).toBeLessThanOrEqual(n << 2)

      const output: number[] = []
      while (!Q.isEmpty()) output.push(Q.dequeue()!)

      const answer: number[] = randomValues.slice().sort((x, y) => y - x)
      expect(output).toEqual(answer)
    }
  })

  test('init - 2', function () {
    for (let n = N; n <= N + 20; ++n) {
      const randomValues: number[] = new Array(n)
      for (let i = 0; i < n; ++i) randomValues[i] = Math.random()

      let compareCnt = 0
      const Q = createPriorityQueue<number>((x, y) => {
        compareCnt += 1
        return x - y
      })

      const bakRandomValues: number[] = randomValues.slice()
      Q.init(randomValues, 3, N)

      expect(randomValues).toEqual(bakRandomValues)
      expect(compareCnt).toBeLessThanOrEqual((N - 3) << 2)

      const output: number[] = []
      while (!Q.isEmpty()) output.push(Q.dequeue()!)

      const answer: number[] = randomValues.slice(3, N).sort((x, y) => y - x)
      expect(output).toEqual(answer)
    }
  })

  test('enqueues', function () {
    const Q = createPriorityQueue<number>((x, y) => x - y)
    Q.enqueue(2)
    expect(Q.size()).toEqual(1)
    expect(Q.top()).toEqual(2)
    Q.enqueues([])
    expect(Q.size()).toEqual(1)
    expect(Q.top()).toEqual(2)
    Q.enqueues([2.3])
    expect(Q.size()).toEqual(2)
    expect(Q.top()).toEqual(2.3)
    Q.enqueues([3, 4, 2])
    expect(Q.size()).toEqual(5)
    expect(Q.top()).toEqual(4)
    expect(Q.dequeue()).toEqual(4)
    expect(Q.dequeue()).toEqual(3)
    expect(Q.dequeue()).toEqual(2.3)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.dequeue()).toEqual(undefined)
    expect(Q.size()).toEqual(0)

    Q.enqueues([3, 2, 6], 1, 2)
    expect(Q.size()).toEqual(1)
    expect(Q.top()).toEqual(2)
    Q.enqueues([7, 8, 9], undefined, 2)
    expect(Q.size()).toEqual(3)
    expect(Q.top()).toEqual(8)
    Q.enqueues([12, 11, 10], -1)
    expect(Q.size()).toEqual(6)
    expect(Q.top()).toEqual(12)
    Q.enqueues([13, 14, 15], 0)
    expect(Q.size()).toEqual(9)
    expect(Q.top()).toEqual(15)
  })

  test('splice', function () {
    const Q = createPriorityQueue<number>((x, y) => x - y)

    const initialElements: number[] = [1, 3, 7, 8, 9, 2, 3, 4, -2, -7, -4, 11]
    const filter1 = (x: number): boolean => x > 0 && x < 10
    const filter2 = (x: number): boolean => x > 7

    Q.init(initialElements)
    expect(Q.size()).toEqual(initialElements.length)

    expect(Q.collect().sort()).toEqual(initialElements.slice().sort())
    Q.splice(filter1)
    expect(Q.collect().sort()).toEqual(initialElements.filter(filter1).sort())

    const newElements = [-2, 8, 9]
    Q.splice(filter2, newElements)
    expect(Q.collect().sort()).toEqual(
      initialElements.filter(filter1).filter(filter2).concat(newElements).sort(),
    )

    Q.splice(() => false)
    expect(Q.size()).toEqual(0)
    expect(Q.top()).toBe(undefined)
    expect(Q.dequeue()).toBe(undefined)

    Q.splice(() => true, [1, 2, 3])
    expect(Q.size()).toEqual(3)
    expect(Q.top()).toBe(3)
    expect(Q.dequeue()).toBe(3)
    expect(Q.collect().sort()).toEqual([1, 2])
  })

  test('replaceTop', function () {
    const Q = createPriorityQueue<number>((x, y) => x - y)

    Q.init([3, 2, 4, -2, -1, 0])
    expect(Q.top()).toEqual(4)
    expect(Q.size()).toEqual(6)
    expect(
      Q.collect()
        .slice()
        .sort((x, y) => x - y),
    ).toEqual([-2, -1, 0, 2, 3, 4])

    Q.replaceTop(7)
    expect(Q.top()).toEqual(7)
    expect(Q.size()).toEqual(6)
    expect(
      Q.collect()
        .slice()
        .sort((x, y) => x - y),
    ).toEqual([-2, -1, 0, 2, 3, 7])

    Q.replaceTop(2)
    expect(Q.top()).toEqual(3)
    expect(Q.size()).toEqual(6)
    expect(
      Q.collect()
        .slice()
        .sort((x, y) => x - y),
    ).toEqual([-2, -1, 0, 2, 2, 3])

    Q.replaceTop(4)
    expect(Q.top()).toEqual(4)
    expect(Q.size()).toEqual(6)
    expect(
      Q.collect()
        .slice()
        .sort((x, y) => x - y),
    ).toEqual([-2, -1, 0, 2, 2, 4])
  })

  test('edge case', function () {
    const Q = createPriorityQueue<number>((x, y) => x - y)
    Q.init()
    Q.enqueue(0)
    Q.enqueue(2)

    expect(Q.size()).toEqual(2)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.size()).toEqual(1)
    expect(Q.dequeue()).toEqual(0)
    expect(Q.size()).toEqual(0)
    expect(Q.dequeue()).toEqual(undefined)
    expect(Q.size()).toEqual(0)

    Q.init(undefined, 0, 1)
    expect(Q.size()).toEqual(0)

    Q.enqueues([1, 2, 3, 4, 5, 6])
    expect(Q.size()).toEqual(6)
    expect(Q.top()).toEqual(6)

    Q.init(undefined)
    expect(Q.size()).toEqual(0)
    Q.replaceTop(2)
    expect(Q.size()).toEqual(1)
    expect(Q.top()).toEqual(2)
    Q.replaceTop(1)
    expect(Q.size()).toEqual(1)
    expect(Q.top()).toEqual(1)
  })
})
