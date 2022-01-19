import { randomInt } from 'crypto'
import {
  createBinaryIndexTree1,
  createBinaryIndexTree1Mod,
  createBinaryIndexTree2,
  createBinaryIndexTree2Mod,
  lowbit,
} from '../src'

describe('tree1', function () {
  const MAX_N = 1000

  test('number', function () {
    const bit = createBinaryIndexTree1<number>(0)
    bit.init(MAX_N)

    const A: number[] = new Array(MAX_N)
      .fill(0)
      .map((_x, i) => randomInt(MAX_N) + 17)
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
    const bit = createBinaryIndexTree1<bigint>(0n)
    bit.init(MAX_N)

    const A: bigint[] = new Array(MAX_N)
      .fill(0)
      .map((_x, i) => BigInt(randomInt(MAX_N) + 17))
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

describe('tree2', function () {
  const MAX_N = 1000

  test('number', function () {
    const bit = createBinaryIndexTree2<number>(0)
    bit.init(MAX_N)

    // Initialize
    const A: number[] = new Array(MAX_N)
      .fill(0)
      .map((_x, i) => randomInt(MAX_N) + 17)
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
    const bit = createBinaryIndexTree2<bigint>(0n)
    bit.init(MAX_N)

    // Initialize
    const A: bigint[] = new Array(MAX_N)
      .fill(0)
      .map((_x, i) => BigInt(randomInt(MAX_N) + 17))
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

describe('tree1-mod', function () {
  const MAX_N = 1000
  const MOD = 1000 + 17

  test('number', function () {
    const bit = createBinaryIndexTree1Mod<number>(0, MOD)
    bit.init(MAX_N)

    const A: number[] = new Array(MAX_N)
      .fill(0)
      .map((_x, i) => randomInt(MOD - 1))
    for (let x = 0; x < MAX_N; ++x) bit.add(x + 1, A[x])

    const getSum = (x: number): number => {
      let result = 0
      for (let i = 0; i < x; ++i) result += A[i]
      return result % MOD
    }

    for (let q = 0; q < 1000; ++q) {
      const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
      const value = Math.round(Math.random() * (MOD - 1))

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
    const bit = createBinaryIndexTree1Mod<bigint>(0n, BigInt(MOD))
    bit.init(MAX_N)

    const A: bigint[] = new Array(MAX_N)
      .fill(0)
      .map((_x, i) => BigInt(randomInt(MOD)))
    for (let x = 0; x < MAX_N; ++x) bit.add(x + 1, A[x])

    const getSum = (x: number): bigint => {
      let result = 0n
      for (let i = 0; i < x; ++i) result += A[i]
      return result % BigInt(MOD)
    }

    for (let q = 0; q < 1000; ++q) {
      const x = Math.max(1, Math.ceil(Math.random() * MAX_N))
      const value = BigInt(Math.round(Math.random() * (MOD - 1)))

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

describe('tree2-mod', function () {
  const MAX_N = 1000
  const MOD = 1000 + 17

  test('number', function () {
    const bit = createBinaryIndexTree2Mod<number>(0, MOD)
    bit.init(MAX_N)

    // Initialize
    const A: number[] = new Array(MAX_N)
      .fill(0)
      .map((_x, i) => randomInt(MOD - 1))
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
    const bit = createBinaryIndexTree2Mod<bigint>(0n, BigInt(MOD))
    bit.init(MAX_N)

    // Initialize
    const A: bigint[] = new Array(MAX_N)
      .fill(0)
      .map((_x, i) => BigInt(randomInt(MOD - 1)))
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
      const value = BigInt(Math.round(Math.random() * (MOD - 1)))

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

describe('util', function () {
  test('lowbit', function () {
    const nums: number[] = new Array(1000).fill(0).map((_x, i) => i + 1)
    for (const x of nums) {
      let answer = 1
      while ((answer & x) === 0) answer <<= 1
      expect(lowbit(x)).toBe(answer)
    }
  })
})
