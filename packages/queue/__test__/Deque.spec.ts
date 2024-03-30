import type { IDeque } from '../src'
import { Deque } from '../src'

describe('Deque', () => {
  let Q: IDeque<number>

  beforeEach(() => {
    Q = new Deque<number>()
  })

  afterEach(() => {
    Q.destroy()
  })

  it('count', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])
    expect(Q.count(() => true)).toEqual(0)

    Q.enqueues([1, 2, 3, 4])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4])
    expect(Q.count(element => element % 2 === 0)).toEqual(2)
    expect(Q.count(element => element % 2 !== 0)).toEqual(2)
    expect(Q.count(() => true)).toEqual(4)
    expect(Q.count(() => false)).toEqual(0)

    Q.enqueue(5)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])
    expect(Q.count(element => element % 2 === 0)).toEqual(2)
    expect(Q.count(element => element % 2 !== 0)).toEqual(3)
    expect(Q.count(() => true)).toEqual(5)
    expect(Q.count(() => false)).toEqual(0)

    expect(Q.size).toEqual(5)
    expect(Q.dequeue_back()).toEqual(5)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4])
    expect(Q.count(element => element % 2 === 0)).toEqual(2)
    expect(Q.count(element => element % 2 !== 0)).toEqual(2)
    expect(Q.count(() => true)).toEqual(4)
    expect(Q.count(() => false)).toEqual(0)
  })

  it('front/back', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])
    expect(Q.front()).toEqual(undefined)
    expect(Q.back()).toEqual(undefined)

    Q.enqueues([1, 2, 3])
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 2, 3])
    expect(Q.front()).toEqual(1)
    expect(Q.back()).toEqual(3)

    Q.enqueue(4)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4])
    expect(Q.front()).toEqual(1)
    expect(Q.back()).toEqual(4)

    Q.enqueue(5)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])
    expect(Q.front()).toEqual(1)
    expect(Q.back()).toEqual(5)

    expect(Q.dequeue()).toEqual(1)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([2, 3, 4, 5])
    expect(Q.front()).toEqual(2)
    expect(Q.back()).toEqual(5)

    expect(Q.dequeue(6)).toEqual(2)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([3, 4, 5, 6])
    expect(Q.front()).toEqual(3)
    expect(Q.back()).toEqual(6)

    expect(Q.dequeue()).toEqual(3)
    expect(Q.dequeue()).toEqual(4)
    expect(Q.dequeue()).toEqual(5)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([6])
    expect(Q.front()).toEqual(6)
    expect(Q.back()).toEqual(6)

    expect(Q.dequeue()).toEqual(6)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])
    expect(Q.front()).toEqual(undefined)
    expect(Q.back()).toEqual(undefined)
  })

  it('destroy', () => {
    expect(Q.destroyed).toEqual(false)

    Q.destroy()
    expect(Q.destroyed).toEqual(true)

    Q.destroy()
    expect(Q.destroyed).toEqual(true)

    expect(() => Q.init()).toThrow('[Deque] `init` is not allowed since it has been destroyed')
  })

  it('init', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.init([])
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.init([1, 2, 3, 4, 5])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

    Q.enqueue(6)
    expect(Q.size).toEqual(6)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6])

    expect(Q.dequeue()).toEqual(1)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([2, 3, 4, 5, 6])

    Q.init([7, 8])
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([7, 8])

    expect(Q.dequeue_back()).toEqual(8)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([7])

    Q.init([])
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])
  })

  it('consuming', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])
    expect(Array.from(Q.consuming())).toEqual([])
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues([1, 2, 3, 4])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4])
    expect(Array.from(Q.consuming())).toEqual([1, 2, 3, 4])
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueue(5)
    Q.enqueue(6)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([5, 6])
    const consumer = Q.consuming()

    expect(consumer.next().value).toEqual(5)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([6])

    Q.enqueues([7, 8])
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([6, 7, 8])

    expect(consumer.next().value).toEqual(6)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([7, 8])

    expect(consumer.next().value).toEqual(7)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([8])

    expect(consumer.next().value).toEqual(8)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(consumer.next().done).toEqual(true)
    expect(consumer.next().value).toEqual(undefined)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])
  })

  it('dequeue', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(Q.dequeue()).toEqual(undefined)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(Q.dequeue(1)).toEqual(undefined)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueues([2, 3, 4, 5])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

    expect(Q.dequeue()).toEqual(1)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([3, 4, 5])

    expect(Q.dequeue()).toEqual(3)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([4, 5])

    Q.enqueue(6)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([4, 5, 6])

    expect(Q.dequeue()).toEqual(4)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([5, 6])

    expect(Q.dequeue(7)).toEqual(5)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([6, 7])

    Q.enqueues([8, 9, 10])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([6, 7, 8, 9, 10])

    expect(Q.dequeue()).toEqual(6)
    expect(Q.dequeue(11)).toEqual(7)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([8, 9, 10, 11])

    expect(Q.dequeue()).toEqual(8)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([9, 10, 11])

    expect(Q.dequeue()).toEqual(9)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([10, 11])

    expect(Q.dequeue()).toEqual(10)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([11])

    expect(Q.dequeue(12)).toEqual(11)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([12])

    expect(Q.dequeue()).toEqual(12)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(Q.dequeue(13)).toEqual(undefined)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([13])

    expect(Q.dequeue()).toEqual(13)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueue(14)
    Q.enqueue_front(15)
    Q.enqueues([16, 17])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([15, 14, 16, 17])

    Q.init([18, 19, 20, 21, 22])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([18, 19, 20, 21, 22])

    expect(Q.dequeue(23)).toEqual(18)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([19, 20, 21, 22, 23])

    expect(Q.dequeue()).toEqual(19)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([20, 21, 22, 23])

    expect(Q.dequeue(24)).toEqual(20)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([21, 22, 23, 24])

    expect(Q.dequeue(25)).toEqual(21)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([22, 23, 24, 25])

    expect(Q.dequeue(26)).toEqual(22)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([23, 24, 25, 26])

    expect(Q.dequeue(27)).toEqual(23)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([24, 25, 26, 27])
  })

  it('enqueue', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueue(1)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueue(2)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([1, 2])

    Q.enqueue(3)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 2, 3])

    Q.enqueue(4)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4])

    expect(Q.dequeue()).toEqual(1)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([2, 3, 4])

    Q.enqueue(5)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([2, 3, 4, 5])

    expect(Q.dequeue()).toEqual(2)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([3, 4, 5])

    Q.enqueue(6)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([3, 4, 5, 6])

    expect(Q.dequeue()).toEqual(3)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([4, 5, 6])

    Q.enqueue(7)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 5, 6, 7])

    expect(Q.dequeue()).toEqual(4)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([5, 6, 7])

    Q.enqueue(8)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([5, 6, 7, 8])

    expect(Q.dequeue()).toEqual(5)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([6, 7, 8])

    Q.enqueue(9)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([6, 7, 8, 9])

    Q.enqueue(10)
    Q.enqueue(11)
    Q.enqueue(12)
    Q.enqueue(13)
    expect(Q.size).toEqual(8)
    expect(Array.from(Q)).toEqual([6, 7, 8, 9, 10, 11, 12, 13])
  })

  it('enqueues', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues([1])
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueues([])
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueues([2, 3])
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 2, 3])

    Q.enqueues([4])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4])

    Q.enqueues([5])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

    Q.enqueues([6, 7])
    expect(Q.size).toEqual(7)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7])

    expect(Q.dequeue()).toEqual(1)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.dequeue()).toEqual(3)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 5, 6, 7])

    Q.enqueues([])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 5, 6, 7])

    Q.enqueues([8, 9, 10, 11, 12, 13, 14])
    expect(Q.size).toEqual(11)
    expect(Array.from(Q)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

    expect(Q.dequeue()).toEqual(4)
    expect(Q.dequeue()).toEqual(5)
    expect(Q.dequeue()).toEqual(6)
    expect(Q.dequeue()).toEqual(7)
    expect(Q.dequeue()).toEqual(8)
    expect(Q.dequeue()).toEqual(9)
    expect(Q.dequeue()).toEqual(10)
  })

  it('enqueues_advance', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(() => Q.enqueues_advance([], 0, 1)).not.toThrow()
    expect(() => Q.enqueues_advance([1], 1, 0)).not.toThrow()
    expect(() => Q.enqueues_advance([1], 0, 2)).not.toThrow()
    expect(() => Q.enqueues_advance([1], -1, 1)).not.toThrow()

    Q.init()
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues_advance([1], 0, 1)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueues_advance([2, 3, 4], 0, 0)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueues_advance([2, 3], 0, 2)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 2, 3])

    Q.enqueues_advance([4], 0, 1)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4])

    Q.enqueues_advance([5], 0, 1)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

    Q.enqueues_advance([-1, 6, 7], 1, 3)
    expect(Q.size).toEqual(7)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7])

    expect(Q.dequeue()).toEqual(1)
    expect(Q.dequeue()).toEqual(2)
    expect(Q.dequeue()).toEqual(3)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 5, 6, 7])

    Q.enqueues_advance([-1, -3], 1, 1)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 5, 6, 7])

    Q.enqueues_advance([-3, 8, 9, 10, 11, 12, 13, 14, -7], 1, 8)
    expect(Q.size).toEqual(11)
    expect(Array.from(Q)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

    expect(Q.dequeue()).toEqual(4)
    expect(Q.dequeue()).toEqual(5)
    expect(Q.dequeue()).toEqual(6)
    expect(Q.dequeue()).toEqual(7)
    expect(Q.dequeue()).toEqual(8)
    expect(Q.dequeue()).toEqual(9)
    expect(Q.dequeue()).toEqual(10)
  })

  it('exclude', () => {
    expect(Q.size).toEqual(0)

    expect(Q.exclude(() => true)).toEqual(0)
    expect(Q.exclude(() => false)).toEqual(0)

    Q.enqueues([1, 2, 3, 4, 5])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

    expect(Q.exclude(element => element % 2 === 0)).toEqual(2)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 3, 5])

    expect(Q.exclude(element => element % 2 === 1)).toEqual(3)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues([1, 3, 2, 4, 5])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 3, 2, 4, 5])

    expect(Q.exclude(element => element % 2 === 0)).toEqual(2)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 3, 5])

    expect(Q.exclude(element => element % 2 === 1)).toEqual(3)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues([1, 3, 5, 2, 4])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 3, 5, 2, 4])

    expect(Q.exclude(element => element % 2 === 0)).toEqual(2)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 3, 5])

    expect(Q.exclude(element => element % 2 === 1)).toEqual(3)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])
  })

  it('dequeue_back', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(Q.dequeue_back()).toEqual(undefined)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues([1, 2, 3, 4, 5])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

    expect(Q.dequeue_back()).toEqual(5)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 4])

    expect(Q.dequeue_back()).toEqual(4)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 2, 3])

    Q.enqueue(6)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([1, 2, 3, 6])

    expect(Q.dequeue_back()).toEqual(6)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([1, 2, 3])

    expect(Q.dequeue_back()).toEqual(3)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([1, 2])

    expect(Q.dequeue()).toEqual(1)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([2])

    Q.enqueues([7, 8, 9, 10])
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([2, 7, 8, 9, 10])

    expect(Q.dequeue_back()).toEqual(10)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([2, 7, 8, 9])

    expect(Q.dequeue()).toEqual(2)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([7, 8, 9])

    expect(Q.dequeue_back()).toEqual(9)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([7, 8])

    expect(Q.dequeue_back()).toEqual(8)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([7])

    expect(Q.dequeue_back()).toEqual(7)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(Q.dequeue_back()).toEqual(undefined)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(Q.dequeue_back()).toEqual(undefined)
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueue(14)
    Q.enqueue_front(15)
    Q.enqueues([16, 17])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([15, 14, 16, 17])
  })

  it('enqueue_front', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueue_front(1)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueue_front(2)
    expect(Q.size).toEqual(2)
    expect(Array.from(Q)).toEqual([2, 1])

    Q.enqueue_front(3)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([3, 2, 1])

    Q.enqueue_front(4)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 3, 2, 1])

    Q.enqueue_front(5)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([5, 4, 3, 2, 1])

    expect(Q.dequeue_back()).toEqual(1)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([5, 4, 3, 2])

    expect(Q.dequeue()).toEqual(5)
    expect(Q.size).toEqual(3)
    expect(Array.from(Q)).toEqual([4, 3, 2])

    Q.enqueue_front(6)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([6, 4, 3, 2])

    Q.enqueue_front(7)
    expect(Q.size).toEqual(5)
    expect(Array.from(Q)).toEqual([7, 6, 4, 3, 2])

    Q.enqueue_front(8)
    expect(Q.size).toEqual(6)
    expect(Array.from(Q)).toEqual([8, 7, 6, 4, 3, 2])

    Q.enqueue_front(9)
    expect(Q.size).toEqual(7)
    expect(Array.from(Q)).toEqual([9, 8, 7, 6, 4, 3, 2])
  })

  it('enqueues_front', () => {
    expect(Q.size).toEqual(0)

    Q.enqueues_front([1])
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueues_front([])
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueues_front([2, 3, 4])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 3, 2, 1])

    Q.enqueues_front([])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 3, 2, 1])

    expect(Array.from(Q.consuming())).toEqual([4, 3, 2, 1])
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues_front([1, 2, 3, 4])
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 3, 2, 1])
  })

  it('enqueues_front_advance', () => {
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    expect(() => Q.enqueues_front_advance([], 0, 1)).not.toThrow()
    expect(() => Q.enqueues_front_advance([1, 2], 1, 3)).not.toThrow()
    expect(() => Q.enqueues_front_advance([1, 2], 2, 1)).not.toThrow()

    Q.init()
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues_front_advance([1], 0, 1)
    expect(Q.size).toEqual(1)
    expect(Array.from(Q)).toEqual([1])

    Q.enqueues_front_advance([2, 3, 4], 0, 3)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 3, 2, 1])

    Q.enqueues_front_advance([2, 3, 4], 1, 1)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 3, 2, 1])

    expect(Array.from(Q.consuming())).toEqual([4, 3, 2, 1])
    expect(Q.size).toEqual(0)
    expect(Array.from(Q)).toEqual([])

    Q.enqueues_front_advance([1, 2, 3, 4], 0, 4)
    expect(Q.size).toEqual(4)
    expect(Array.from(Q)).toEqual([4, 3, 2, 1])
  })
})
