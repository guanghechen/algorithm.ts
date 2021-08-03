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

    const maximum = randomValues.reduce(
      (acc, x) => Math.max(acc, x),
      Number.MIN_SAFE_INTEGER,
    )

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
    expect(Q.collect().sort((x, y) => x - y)).toEqual(
      randomValues.slice().sort((x, y) => x - y),
    )
  })
})
