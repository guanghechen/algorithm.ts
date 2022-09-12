import { randomInt } from '@algorithm.ts/shuffle'
import { IntervalUpdateSingleQuery } from '../src'

describe('IntervalUpdateSingleQuery', function () {
  describe('basic', function () {
    const MAX_N = 1000
    test('number', function () {
      const bit = new IntervalUpdateSingleQuery<number>({
        operator: {
          ZERO: 0,
          add: (x, y) => x + y,
        },
      })
      bit.init(MAX_N)

      // Initialize
      const A: number[] = new Array(MAX_N).fill(0).map(() => randomInt(MAX_N) + 17)
      for (let x = 0; x < MAX_N; ++x) {
        bit.add(x, -A[x])
        bit.add(x + 1, A[x])
      }

      // Test for initialization.
      for (let x = 1; x <= MAX_N; ++x) expect(bit.query(x)).toBe(A[x - 1])

      const performAdd = (x: number, value: number): void => {
        for (let i = 0; i < x; ++i) A[i] += value
      }

      for (let q = 0; q < 1000; ++q) {
        const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
        const value = Math.round(Math.random() * MAX_N * 2)

        performAdd(x, value)
        bit.add(x, value)
        expect(bit.query(x)).toBe(A[x - 1])
      }

      // Test illegal input.
      bit.add(0, 1)
      bit.add(-1, 1)
      bit.query(0)
      bit.query(1)
    })

    test('bigint', function () {
      const bit = new IntervalUpdateSingleQuery<bigint>({
        operator: {
          ZERO: 0n,
          add: (x, y) => x + y,
        },
      })
      bit.init(MAX_N)

      // Initialize
      const A: bigint[] = new Array(MAX_N).fill(0).map(() => BigInt(randomInt(MAX_N) + 17))
      for (let x = 0; x < MAX_N; ++x) {
        bit.add(x, -A[x])
        bit.add(x + 1, A[x])
      }

      // Test for initialization.
      for (let x = 1; x <= MAX_N; ++x) expect(bit.query(x)).toBe(A[x - 1])

      const performAdd = (x: number, value: bigint): void => {
        for (let i = 0; i < x; ++i) A[i] += value
      }

      for (let q = 0; q < 1000; ++q) {
        const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
        const value = BigInt(Math.round(Math.random() * MAX_N * 2))

        performAdd(x, value)
        bit.add(x, value)
        expect(bit.query(x)).toBe(A[x - 1])
      }

      // Test illegal input.
      bit.add(0, 1n)
      bit.add(-1, 1n)
      bit.query(0)
      bit.query(-1)
    })
  })

  describe('modulo', function () {
    const MAX_N = 1000

    test('number', function () {
      const MOD = 1000 + 17
      const bit = new IntervalUpdateSingleQuery<number>({
        operator: {
          ZERO: 0,
          add: (x, y) => {
            const z = x + y
            return z >= MOD ? z - MOD : z < 0 ? z + MOD : z
          },
        },
      })
      bit.init(MAX_N)

      // Initialize
      const A: number[] = new Array(MAX_N).fill(0).map((_x, i) => randomInt(MOD - 1))
      for (let x = 0; x < MAX_N; ++x) {
        bit.add(x, -A[x])
        bit.add(x + 1, A[x])
      }

      // Test for initialization.
      for (let x = 1; x <= MAX_N; ++x) expect(bit.query(x)).toBe(A[x - 1])

      const performAdd = (x: number, value: number): void => {
        for (let i = 0; i < x; ++i) A[i] += value
      }

      for (let q = 0; q < 1000; ++q) {
        const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
        const value = Math.round(Math.random() * (MOD - 1))

        performAdd(x, value)
        bit.add(x, value)
        expect(bit.query(x)).toBe(A[x - 1] % MOD)
      }

      // Test illegal input.
      bit.add(0, 1)
      bit.add(-1, 1)
      bit.query(0)
      bit.query(1)
    })

    test('bigint', function () {
      const MOD = BigInt(1000 + 17)
      const bit = new IntervalUpdateSingleQuery<bigint>({
        operator: {
          ZERO: 0n,
          add: (x, y) => {
            const z = x + y
            return z >= MOD ? z - MOD : z < 0n ? z + MOD : z
          },
        },
      })
      bit.init(MAX_N)

      // Initialize
      const A: bigint[] = new Array(MAX_N)
        .fill(0)
        .map((_x, i) => BigInt(randomInt(Number(MOD) - 1)))
      for (let x = 0; x < MAX_N; ++x) {
        bit.add(x, -A[x])
        bit.add(x + 1, A[x])
      }

      // Test for initialization.
      for (let x = 1; x <= MAX_N; ++x) expect(bit.query(x)).toBe(A[x - 1])

      const performAdd = (x: number, value: bigint): void => {
        for (let i = 0; i < x; ++i) A[i] += value
      }

      for (let q = 0; q < 1000; ++q) {
        const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
        const value = BigInt(Math.round(Math.random() * (Number(MOD) - 1)))

        performAdd(x, value)
        bit.add(x, value)
        expect(bit.query(x)).toBe(A[x - 1] % BigInt(MOD))
      }

      // Test illegal input.
      bit.add(0, 1n)
      bit.add(-1, 1n)
      bit.query(0)
      bit.query(-1)
    })
  })
  test('edge', function () {
    const bit = new IntervalUpdateSingleQuery<number>({
      operator: {
        ZERO: 0,
        add: (x, y) => x + y,
      },
    })

    expect(() => bit.init(1)).not.toThrow()
    expect(() => bit.init(0)).toThrow(
      /\[IntervalUpdateSingleQuery\] N is expected to be a positive integer, but got /,
    )
    expect(() => bit.init(-1)).toThrow(
      /\[IntervalUpdateSingleQuery\] N is expected to be a positive integer, but got /,
    )
  })
})
