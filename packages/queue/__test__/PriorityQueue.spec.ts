import type { IPriorityQueue } from '../src'
import { PriorityQueue } from '../src'

describe('PriorityQueue', function () {
  let Q: IPriorityQueue<number>

  beforeEach(() => {
    Q = new PriorityQueue<number>({ compare: (x, y) => x - y })
  })

  afterEach(() => {
    Q.destroy()
  })

  it('constructor', () => {
    const Q1 = new PriorityQueue<number>({ compare: (x, y) => x - y })
    Q1.enqueues([1, 2, 3, 4, 5])
    expect(Q1.dequeue()).toEqual(1)
    expect(Q1.dequeue()).toEqual(2)
    expect(Q1.dequeue()).toEqual(3)
    expect(Q1.dequeue()).toEqual(4)
    expect(Q1.dequeue()).toEqual(5)
    expect(Q1.dequeue()).toEqual(undefined)
    expect(Q1.size).toEqual(0)

    const Q2 = new PriorityQueue<number>({ compare: (x, y) => y - x })
    Q2.enqueues([1, 2, 3, 4, 5])
    expect(Q2.dequeue()).toEqual(5)
    expect(Q2.dequeue()).toEqual(4)
    expect(Q2.dequeue()).toEqual(3)
    expect(Q2.dequeue()).toEqual(2)
    expect(Q2.dequeue()).toEqual(1)
    expect(Q2.dequeue()).toEqual(undefined)
    expect(Q2.size).toEqual(0)
  })

  it('count', () => {
    Q.enqueues([1, 2, 3, 4, 5])
    expect(Q.count(x => x % 2 === 0)).toEqual(2)
    expect(Q.count(x => x % 2 === 1)).toEqual(3)
  })

  it('front', () => {
    expect(Q.size).toEqual(0)

    Q.enqueues([5, 2, 1, 3, 4])
    expect(Q.size).toEqual(5)
    expect(Q.front()).toEqual(1)
    expect(Q.front()).toEqual(1)

    expect(Q.dequeue()).toEqual(1)
    expect(Q.size).toEqual(4)
    expect(Q.front()).toEqual(2)
    expect(Q.front()).toEqual(2)

    expect(Q.dequeue()).toEqual(2)
    expect(Q.size).toEqual(3)
    expect(Q.front()).toEqual(3)
    expect(Q.front()).toEqual(3)

    expect(Q.dequeue()).toEqual(3)
    expect(Q.size).toEqual(2)
    expect(Q.front()).toEqual(4)
    expect(Q.front()).toEqual(4)

    expect(Q.dequeue()).toEqual(4)
    expect(Q.size).toEqual(1)
    expect(Q.front()).toEqual(5)
    expect(Q.front()).toEqual(5)

    expect(Q.dequeue()).toEqual(5)
    expect(Q.size).toEqual(0)
    expect(Q.front()).toEqual(undefined)
    expect(Q.front()).toEqual(undefined)
  })

  it('destroy', () => {
    expect(Q.destroyed).toEqual(false)

    Q.destroy()
    expect(Q.destroyed).toEqual(true)

    Q.destroy()
    expect(Q.destroyed).toEqual(true)

    expect(() => Q.init()).toThrow(
      '[PriorityQueue] `init` is not allowed since it has been destroyed',
    )
  })

  it('init', () => {
    expect(Q.size).toEqual(0)

    Q.init([1, 3, 2, 5, 4])
    expect(Q.size).toEqual(5)

    Q.init([6, 9, 8, 7])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q.consuming())).toEqual([6, 7, 8, 9])
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.init([])
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])
  })

  it('consuming', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q.consuming())).toEqual([])
    expect(Q.size).toEqual(0)

    Q.enqueues([1, 3, 2, 5, 4])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q.consuming())).toEqual([1, 2, 3, 4, 5])
    expect(Q.size).toEqual(0)

    Q.enqueues([6, 9, 8, 7])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q.consuming())).toEqual([6, 7, 8, 9])
    expect(Q.size).toEqual(0)
  })

  it('dequeue', () => {
    expect(Q.size).toEqual(0)
    expect(Q.dequeue()).toEqual(undefined)

    Q.enqueues([1, 3, 2, 5, 4])
    expect(Q.size).toEqual(5)

    expect(Q.dequeue()).toEqual(1)
    expect(Q.size).toEqual(4)

    expect(Q.dequeue(1)).toEqual(2)
    expect(Q.size).toEqual(4)

    expect(Q.dequeue()).toEqual(1)
    expect(Q.size).toEqual(3)

    expect(Q.dequeue(3)).toEqual(3)
    expect(Q.size).toEqual(3)

    expect(Q.dequeue()).toEqual(3)
    expect(Q.size).toEqual(2)

    expect(Q.dequeue(6)).toEqual(4)
    expect(Q.size).toEqual(2)

    expect(Q.dequeue()).toEqual(5)
    expect(Q.size).toEqual(1)

    expect(Q.dequeue()).toEqual(6)
    expect(Q.size).toEqual(0)

    expect(Q.dequeue()).toEqual(undefined)
    expect(Q.size).toEqual(0)

    expect(Q.dequeue(7)).toEqual(undefined)
    expect(Q.size).toEqual(1)

    expect(Q.dequeue()).toEqual(7)
    expect(Q.size).toEqual(0)
  })

  it('enqueue', () => {
    expect(Q.size).toEqual(0)

    Q.enqueue(1)
    expect(Q.size).toEqual(1)

    Q.enqueue(3)
    expect(Q.size).toEqual(2)

    Q.enqueue(2)
    expect(Q.size).toEqual(3)

    Q.enqueue(5)
    expect(Q.size).toEqual(4)

    Q.enqueue(4)
    expect(Q.size).toEqual(5)

    expect(Array.from(Q.consuming())).toEqual([1, 2, 3, 4, 5])
    expect(Q.size).toEqual(0)
  })

  it('enqueues', () => {
    expect(Q.size).toEqual(0)

    Q.enqueues([1, 3, 2, 5, 4])
    expect(Q.size).toEqual(5)

    Q.enqueues([6])
    expect(Q.size).toEqual(6)

    Q.enqueues([9, 8, 7])
    expect(Q.size).toEqual(9)

    Q.enqueues([10, 11])
    expect(Q.size).toEqual(11)

    Q.enqueues([])
    expect(Q.size).toEqual(11)

    Q.enqueues([15, 14, 12, 13])
    expect(Q.size).toEqual(15)

    Q.enqueues([16])
    expect(Q.size).toEqual(16)

    Q.enqueues([])
    expect(Q.size).toEqual(16)

    expect(Array.from(Q.consuming())).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ])
    expect(Q.size).toEqual(0)
  })

  it('enqueues_advance', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(() => Q.enqueues_advance([6], 0, 5)).not.toThrow()
    expect(() => Q.enqueues_advance([6], 1, 0)).not.toThrow()
    expect(() => Q.enqueues_advance([6], -1, 0)).not.toThrow()
    expect(() => Q.enqueues_advance([6], -1, 1)).not.toThrow()

    Q.init()
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues_advance([1, 3, 2, 5, 4], 0, 5)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q).length).toEqual(5)
    expect(Array.from(Q.consuming())).toEqual([1, 2, 3, 4, 5])

    Q.enqueues_advance([1, 3, 2, 5, 4], 1, 3)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q.consuming())).toEqual([2, 3])

    Q.enqueues_advance([1, 3, 2, 5, 4, 6], 0, 6)
    expect(Q.size).toEqual(6)

    Q.enqueues_advance([-1, 9, 8, 7, -3], 1, 4)
    expect(Q.size).toEqual(9)

    Q.enqueues_advance([10, 11, -5, -6], 0, 2)
    expect(Q.size).toEqual(11)

    Q.enqueues_advance([-7, -8], 1, 1)
    expect(Q.size).toEqual(11)

    Q.enqueues_advance([15, 14, 12, 13], 0, 4)
    expect(Q.size).toEqual(15)

    Q.enqueues_advance([-9, -10, -11, 16], 3, 4)
    expect(Q.size).toEqual(16)

    Q.enqueues_advance([], 0, 0)
    expect(Q.size).toEqual(16)
    expect(Array.from(Q).length).toEqual(16)

    Q.enqueues_advance([25, 27, 28, 29, 17, 18, 21, 22, 23, 19, 20, 24, 26, 30, 31], 1, 11)
    expect(Q.size).toEqual(26)
    expect(Array.from(Q).length).toEqual(26)

    expect(Array.from(Q.consuming())).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 27, 28, 29,
    ])
    expect(Q.size).toEqual(0)
  })

  it('exclude', () => {
    expect(Q.size).toEqual(0)

    Q.enqueues([1, 3, 2, 5, 4])
    expect(Q.size).toEqual(5)

    expect(Q.exclude(x => x % 2 === 0)).toEqual(2)
    expect(Q.size).toEqual(3)

    expect(Q.exclude(x => x % 2 === 1)).toEqual(3)
    expect(Q.size).toEqual(0)

    expect(Q.exclude(x => x % 2 === 1)).toEqual(0)
    expect(Q.size).toEqual(0)

    expect(Q.exclude(x => x % 2 === 0)).toEqual(0)
    expect(Q.size).toEqual(0)

    Q.init([1, 3, 2, 5, 4])
    expect(Q.exclude(() => false)).toEqual(0)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q.consuming())).toEqual([1, 2, 3, 4, 5])

    Q.init([1, 3, 2, 5, 4])
    expect(Q.exclude(x => x === 5)).toEqual(1)
    expect(Array.from(Q.consuming())).toEqual([1, 2, 3, 4])
  })
})
