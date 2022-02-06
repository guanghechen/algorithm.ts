/**
 * Sliding window is an algorithm for solving extreme values in a fixed width
 * interval.
 */
export interface ISlidingWindow {
  /**
   * Initialize a sliding window.
   * @param WINDOW_SIZE
   */
  init(WINDOW_SIZE: number, startIdx?: number): void

  /**
   * Move the sliding window forward with specified steps.
   */
  moveForward(steps?: number): void

  /**
   * Get the index of the maximum value in the sliding window.
   */
  max(): number
}

/**
 * Create a sliding window with a fixed width of `WINDOW_SIZE`, and maintain the
 * index of a node with with the largest value in the window.
 *
 * @param WINDOW_SIZE
 * @param cmp
 */
export function createSlidingWindow(
  cmp: (x: number, y: number) => -1 | 0 | 1 | number,
): ISlidingWindow {
  let front: number
  let end: number
  let idx: number
  let WINDOW_SIZE: number
  const window: number[] = []
  return { init, moveForward, max }

  function init(_WINDOW_SIZE: number, startIdx = 0): void {
    WINDOW_SIZE = Math.max(1, _WINDOW_SIZE)
    window.length = 0
    front = 0
    end = -1
    idx = startIdx
  }

  function moveForward(steps = 1): void {
    for (let i = 0; i < steps; ++i) {
      if (front <= end && idx - window[front] >= WINDOW_SIZE) front += 1

      for (; front <= end; end -= 1) {
        const delta: number = cmp(window[end], idx)
        if (delta > 0) break
      }

      // eslint-disable-next-line no-plusplus
      window[++end] = idx++
    }
  }

  function max(): number {
    return window[front]
  }
}
