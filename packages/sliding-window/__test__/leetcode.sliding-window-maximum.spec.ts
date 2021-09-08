import { createSlidingWindow } from '../src'

test('sliding-window-maximum', function () {
  const data: Array<{
    input: Parameters<typeof maxSlidingWindow>
    answer: ReturnType<typeof maxSlidingWindow>
  }> = [
    {
      input: [[1, 3, -1, -3, 5, 3, 6, 7], 3],
      answer: [3, 3, 5, 5, 6, 7],
    },
    {
      input: [[1], 1],
      answer: [1],
    },
    {
      input: [[1, -1], 1],
      answer: [1, -1],
    },
    {
      input: [[9, 11], 2],
      answer: [11],
    },
    {
      input: [[4, -2], 2],
      answer: [4],
    },
  ]

  for (const { input, answer } of data) {
    expect(maxSlidingWindow(...input)).toEqual(answer)
  }
})

/**
 * A solution of https://leetcode.com/problems/sliding-window-maximum/
 */
function maxSlidingWindow(nums: number[], K: number): number[] {
  const N = nums.length
  if (N < K) return []

  const results: number[] = []
  const window = createSlidingWindow(K, (x, y) => nums[x] - nums[y])
  window.init()

  for (let i = 0, _end = K - 1; i < _end; ++i) window.push(i)

  for (let i = K - 1; i < N; ++i) {
    window.push(i)
    results.push(nums[window.max()])
  }
  return results
}
