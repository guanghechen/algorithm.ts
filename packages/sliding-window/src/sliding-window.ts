import type { ICompare } from '@algorithm.ts/internal'
import type { ISlidingWindow, ISlidingWindowResetOptions } from './types'

export interface ISlidingWindowProps {
  /**
   * The width of the sliding window.
   */
  WINDOW_SIZE: number
  /**
   * The first index of the input range.
   */
  startIndex?: number
  /**
   * Compare two index to determine which one is smaller.
   */
  compare: ICompare<number>
}

export class SlidingWindow implements ISlidingWindow {
  protected readonly _WINDOW_SIZE: number
  protected readonly _compare: ICompare<number>
  protected readonly _window: number[]
  protected _front: number
  protected _end: number
  protected _size: number
  protected _leftBoundary: number
  protected _rightBoundary: number

  constructor(props: ISlidingWindowProps) {
    const { WINDOW_SIZE, startIndex = 0, compare } = props
    this._WINDOW_SIZE = WINDOW_SIZE
    this._compare = compare
    this._window = new Array(WINDOW_SIZE)
    this._front = 0
    this._end = -1
    this._size = 0
    this._leftBoundary = startIndex
    this._rightBoundary = startIndex
  }

  public reset(options: ISlidingWindowResetOptions = {}): void {
    const { startIndex = 0, WINDOW_SIZE = this._WINDOW_SIZE } = options
    ;(this._WINDOW_SIZE as number) = WINDOW_SIZE
    this._window.length = WINDOW_SIZE
    this._front = 0
    this._end = -1
    this._size = 0
    this._leftBoundary = startIndex
    this._rightBoundary = startIndex
  }

  public forwardRightBoundary(steps = 1): void {
    if (steps < 1) return

    const { _WINDOW_SIZE, _window, _compare } = this
    let { _rightBoundary, _front, _end, _size } = this

    const nextRightBoundary: number = _rightBoundary + steps
    const nextLeftBoundary = Math.max(this._leftBoundary, nextRightBoundary - _WINDOW_SIZE)
    if (_rightBoundary < nextLeftBoundary) _rightBoundary = nextLeftBoundary

    // Popup elements that are about to disappear on the left side of the sliding window.
    while (_size > 0 && _window[_front] < nextLeftBoundary) {
      _front = this._forwardIndex(_front)
      _size -= 1
    }

    for (; _rightBoundary < nextRightBoundary; ++_rightBoundary) {
      // Popup all of the indexes from window which are >= idx.
      for (; _size > 0; --_size) {
        if (_compare(_window[_end], _rightBoundary) < 0) break
        _end = this._backwardIndex(_end)
      }

      _end = this._forwardIndex(_end)
      _window[_end] = _rightBoundary
      _size += 1
    }

    this._front = _front
    this._end = _end
    this._size = _size
    this._leftBoundary = nextLeftBoundary
    this._rightBoundary = nextRightBoundary
  }

  public forwardLeftBoundary(steps = 1): void {
    if (steps < 1) return

    const nextLeftBoundary = this._leftBoundary + steps
    const { _window } = this
    while (this._size > 0 && _window[this._front] < nextLeftBoundary) {
      this._front = this._forwardIndex(this._front)
      this._size -= 1
    }
    this._leftBoundary = nextLeftBoundary
  }

  public min(): number | undefined {
    return this._size > 0 ? this._window[this._front] : undefined
  }

  protected _forwardIndex(index: number): number {
    const nextIndex = index + 1
    return nextIndex === this._WINDOW_SIZE ? 0 : nextIndex
  }

  protected _backwardIndex(index: number): number {
    const nextIndex = index - 1
    return nextIndex < 0 ? this._WINDOW_SIZE - 1 : nextIndex
  }
}
