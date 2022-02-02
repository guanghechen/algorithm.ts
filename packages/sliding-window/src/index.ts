/**
 * Sliding window is an algorithm for solving extreme values in a fixed width
 * interval.
 */
export interface ISlidingWindow {
  /**
   * Initialize a sliding window.
   * @param WINDOW_SIZE
   */
  init(WINDOW_SIZE?: number): void

  /**
   * See a new element with index `idx`.
   * @param idx
   */
  push(idx: number): void

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
  _WINDOW_SIZE: number,
  cmp: (x: number, y: number) => -1 | 0 | 1 | number,
): ISlidingWindow {
  let front = 0
  let end = -1
  let WINDOW_SIZE: number = _WINDOW_SIZE
  const window: number[] = []
  return { init, push, max }

  function init(_WINDOW_SIZE?: number): void {
    if (_WINDOW_SIZE != null) WINDOW_SIZE = _WINDOW_SIZE
    window.length = 0
    front = 0
    end = -1
  }

  function push(idx: number): void {
    if (front <= end && idx - window[front] >= WINDOW_SIZE) front += 1

    for (; front <= end; end -= 1) {
      const delta: number = cmp(window[end], idx)
      if (delta > 0) break
    }

    // eslint-disable-next-line no-plusplus
    window[++end] = idx
  }

  function max(): number {
    return window[front]
  }
}
