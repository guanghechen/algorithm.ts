/**
 * Sliding window is an algorithm for solving extreme values in a fixed width interval.
 */
export interface ISlidingWindow {
  /**
   * Reset the sliding window.
   * @param options
   */
  reset(options?: ISlidingWindowResetOptions): void
  /**
   * Move the sliding window right boundary forward by `steps` steps.
   * @param steps
   */
  forwardRightBoundary(steps?: number): void
  /**
   * Move the sliding window left boundary forward by `steps` steps.
   * @param steps
   */
  forwardLeftBoundary(steps?: number): void
  /**
   * Return the minimum element in the Sliding Window.
   */
  min(): number | undefined
}

export interface ISlidingWindowResetOptions {
  /**
   * The width of the sliding window.
   */
  WINDOW_SIZE?: number
  /**
   * The first index of the input range.
   */
  startIndex?: number
}
