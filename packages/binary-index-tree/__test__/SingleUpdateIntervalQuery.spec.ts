import { randomInt } from '@algorithm.ts/shuffle'
import { SingleUpdateIntervalQuery } from '../src'

describe('SingleUpdateIntervalQuery', function () {
  describe('basic', function () {
    const MAX_N = 1000

    test('number', function () {
      const bit = new SingleUpdateIntervalQuery<number>({
        operator: {
          ZERO: 0,
          add: (x, y) => x + y,
        },
      })
      bit.init(MAX_N)

      // Initialize
      const A: number[] = new Array(MAX_N).fill(0).map((_x, i) => randomInt(MAX_N) + 17)
      for (let x = 0; x < MAX_N; ++x) bit.add(x + 1, A[x])

      const getSum = (x: number): number => {
        let result = 0
        for (let i = 0; i < x; ++i) result += A[i]
        return result
      }

      for (let q = 0; q < 1000; ++q) {
        const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
        const value = Math.round(Math.random() * MAX_N * 2)

        A[x - 1] += value
        bit.add(x, value)
        expect(bit.query(x)).toBe(getSum(x))
      }

      // Test illegal input.
      bit.add(0, 1)
      bit.add(-1, 1)
      bit.query(0)
      bit.query(-1)
    })

    test('bigint', function () {
      const bit = new SingleUpdateIntervalQuery<bigint>({
        operator: {
          ZERO: 0n,
          add: (x, y) => x + y,
        },
      })
      bit.init(MAX_N)

      // Initialize
      const A: bigint[] = new Array(MAX_N).fill(0).map((_x, i) => BigInt(randomInt(MAX_N) + 17))
      for (let x = 0; x < MAX_N; ++x) bit.add(x + 1, A[x])

      const getSum = (x: number): bigint => {
        let result = 0n
        for (let i = 0; i < x; ++i) result += A[i]
        return result
      }

      for (let q = 0; q < 1000; ++q) {
        const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
        const value = BigInt(Math.round(Math.random() * MAX_N * 2))

        A[x - 1] += value
        bit.add(x, value)
        expect(bit.query(x)).toBe(getSum(x))
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
      const bit = new SingleUpdateIntervalQuery<number>({
        operator: {
          ZERO: 0,
          add: (x, y) => {
            const z = x + y
            return z >= MOD ? z - MOD : z < 0 ? z + MOD : z
          },
        },
      })
      bit.init(MAX_N)

      const A: number[] = new Array(MAX_N).fill(0).map(() => randomInt(MOD - 1))
      for (let x = 0; x < MAX_N; ++x) bit.add(x + 1, A[x])

      const getSum = (x: number): number => {
        let result = 0
        for (let i = 0; i < x; ++i) result += A[i]
        return result % MOD
      }

      for (let q = 0; q < 1000; ++q) {
        const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
        const value = Math.round(Math.random() * MOD * 2) - MOD

        A[x - 1] = (((A[x - 1] + value) % MOD) + MOD) % MOD
        bit.add(x, value)
        expect(bit.query(x)).toBe(getSum(x))
      }

      // Test illegal input.
      bit.add(0, 1)
      bit.add(-1, 1)
      bit.query(0)
      bit.query(-1)
    })

    test('bigint', function () {
      const MOD = BigInt(1000 + 17)
      const bit = new SingleUpdateIntervalQuery<bigint>({
        operator: {
          ZERO: 0n,
          add: (x, y) => {
            const z = x + y
            return z >= MOD ? z - MOD : z < 0n ? z + MOD : z
          },
        },
      })
      bit.init(MAX_N)

      const A: bigint[] = new Array(MAX_N).fill(0).map(() => BigInt(randomInt(Number(MOD))))
      for (let x = 0; x < MAX_N; ++x) bit.add(x + 1, A[x])

      const getSum = (x: number): bigint => {
        let result = 0n
        for (let i = 0; i < x; ++i) result += A[i]
        return result % BigInt(MOD)
      }

      for (let q = 0; q < 1000; ++q) {
        const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
        const value = BigInt(Math.round(Math.random() * (Number(MOD) - 1)))

        A[x - 1] += value
        bit.add(x, value)
        expect(bit.query(x)).toBe(getSum(x))
      }

      // Test illegal input.
      bit.add(0, 1n)
      bit.add(-1, 1n)
      bit.query(0)
      bit.query(-1)
    })
  })

  test('edge', function () {
    const bit = new SingleUpdateIntervalQuery<number>({
      operator: {
        ZERO: 0,
        add: (x, y) => x + y,
      },
    })

    expect(() => bit.init(1)).not.toThrow()
    expect(() => bit.init(0)).toThrow(
      /\[SingleUpdateIntervalQuery\] N is expected to be a positive integer, but got /,
    )
    expect(() => bit.init(-1)).toThrow(
      /\[SingleUpdateIntervalQuery\] N is expected to be a positive integer, but got /,
    )
  })
})
