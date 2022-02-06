import { createSlidingWindow } from '../../src'

export default maxSlidingWindow

export function maxSlidingWindow(nums: number[], K: number): number[] {
  const N = nums.length
  if (N < K) return []

  const results: number[] = []
  const window = createSlidingWindow((x, y) => nums[x] - nums[y])
  window.init(K)

  window.moveForward(K - 1)
  for (let i = K - 1; i < N; ++i) {
    window.moveForward()
    results.push(nums[window.max()])
  }
  return results
}
