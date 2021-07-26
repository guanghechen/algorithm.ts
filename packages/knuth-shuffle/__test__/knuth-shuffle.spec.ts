import { knuthShuffle } from '../src'

describe('knuth-shuffle', function () {
  const ebs = 2
  const size = 1e2
  const shuffleTimes = 1e4

  const nums: number[] = new Array(size)
  const count: number[] = new Array(size).fill(0)

  for (let i = 0; i < size; ++i) nums[i] = i
  for (let t = 0; t < shuffleTimes; ++t) {
    knuthShuffle(nums)
    for (let i = 0; i < size; ++i) {
      count[i] += nums[i]
    }
  }

  test('random', function () {
    expect(nums.some((x, i) => x !== i)).toBe(true)
  })

  test('uniformly distribute', function () {
    const mean: number = count[0] / shuffleTimes
    for (let i = 1; i < size; ++i) {
      expect(Math.abs(count[i] / shuffleTimes - mean)).toBeLessThanOrEqual(ebs)
    }
  })

  test('sub-array', function () {
    const nums: number[] = new Array(size)
    for (let i = 0; i < size; ++i) nums[i] = i

    const start = 10
    const end = 70
    knuthShuffle(nums, start, end)
    for (let i = 0; i < start; ++i) expect(nums[i]).toBe(i)
    for (let i = end; i < size; ++i) expect(nums[i]).toBe(i)

    let diff = 0
    for (let i = start; i < end; ++i) diff = nums[i] === i ? 0 : 1
    expect(diff).toBeGreaterThan(0)
  })

  test('out of boundary', function () {
    const nums: number[] = new Array(size)
    for (let i = 0; i < size; ++i) nums[i] = i

    knuthShuffle(nums, 200, 1)
    expect(nums.every((x, i) => x === i)).toBe(true)

    knuthShuffle(nums, -2, 50)
    for (let i = 50; i < size; ++i) expect(nums[i]).toBe(i)

    let diff = 0
    for (let i = 0; i < 50; ++i) diff = nums[i] === i ? 0 : 1
    expect(diff).toBeGreaterThan(0)
  })
})
