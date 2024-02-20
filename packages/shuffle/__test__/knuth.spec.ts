import { knuthShuffle } from '../src'

describe('knuth-shuffle', function () {
  const size = 1e3
  const ebs = size / 10
  const shuffleTimes = 1e3

  const nums: number[] = new Array(size)
  const count: number[] = new Array(size).fill(0)

  for (let i = 0; i < size; ++i) nums[i] = i
  for (let t = 0; t < shuffleTimes; ++t) {
    knuthShuffle(nums)
    for (let i = 0; i < size; ++i) {
      count[i] += nums[i]
    }
  }

  it('random', function () {
    expect(nums.some((x, i) => x !== i)).toEqual(true)
  })

  it('uniformly distribute', function () {
    const min = Math.min(...count) / shuffleTimes
    const max = Math.max(...count) / shuffleTimes
    expect(max - min).toBeLessThanOrEqual(ebs)
  })

  it('sub-array', function () {
    const nums: number[] = new Array(size)
    for (let i = 0; i < size; ++i) nums[i] = i

    const start = 10
    const end = 70
    knuthShuffle(nums, start, end)
    for (let i = 0; i < start; ++i) expect(nums[i]).toEqual(i)
    for (let i = end; i < size; ++i) expect(nums[i]).toEqual(i)

    let diff = 0
    for (let i = start; i < end; ++i) diff = nums[i] === i ? 0 : 1
    expect(diff).toBeGreaterThan(0)
  })

  it('out of boundary', function () {
    const nums: number[] = new Array(size)
    for (let i = 0; i < size; ++i) nums[i] = i

    knuthShuffle(nums, 200, 1)
    expect(nums.every((x, i) => x === i)).toEqual(true)

    knuthShuffle(nums, -2, 50)
    for (let i = 50; i < size; ++i) expect(nums[i]).toEqual(i)

    for (let i = 0; i < size; ++i) nums[i] = i
    knuthShuffle(nums, -1, size + 1)
    const diff = nums.reduce((acc, v, i) => acc + (v === i ? 0 : 1), 0)
    expect(diff).toBeGreaterThan(0)
  })
})
