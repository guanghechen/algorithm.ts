import { randomInt } from '../src'

test('randomInt', function () {
  const size = 1e2
  const nums: number[] = new Array(size)

  for (let i = 0; i < size; ++i) {
    nums[i] = randomInt(size)
  }

  expect(nums.some(x => x !== nums[0])).toBe(true)
  expect(nums.every(x => x >= 0 && x < size)).toBe(true)
  expect(nums.every(x => Math.floor(x) === x)).toBe(true)
})
