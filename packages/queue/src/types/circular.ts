import type { IDeque, IReadonlyDeque } from './deque'

export interface IReadonlyCircularQueue<T> extends IReadonlyDeque<T> {}

export interface ICircularQueue<T> extends IReadonlyCircularQueue<T>, IDeque<T> {
  /**
   * Resize the max-size of queue with the given size.
   */
  resize(MAX_SIZE: number): void
  /**
   * Rearrange elements, that is, put the first element in place 0-index.
   */
  rearrange(): void
}
