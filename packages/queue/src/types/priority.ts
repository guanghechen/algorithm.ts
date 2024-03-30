import type { IQueue, IReadonlyQueue } from './queue'

export interface IReadonlyPriorityQueue<T> extends IReadonlyQueue<T> {}

export interface IPriorityQueue<T> extends IReadonlyPriorityQueue<T>, IQueue<T> {}
