import { knuthShuffle } from '../src'

describe('knuth-shuffle', function () {
  const ebs = 5
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
    for (let i = 1; i < size; ++i) {
      expect(
        Math.abs(count[i] - count[i - 1]) / shuffleTimes,
      ).toBeLessThanOrEqual(ebs)
    }
  })
})
