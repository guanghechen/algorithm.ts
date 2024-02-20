import { CircularQueue } from '../src'

describe('CircularQueue', function () {
  describe('fixed size', function () {
    it('basic', function () {
      const SIZE = 1000
      const data = new Array(SIZE).fill(0).map((_x, i) => i)
      const capacity = 7
      const Q = new CircularQueue<number>({ autoResize: false, capacity })

      for (let i = 0; i < SIZE; ++i) {
        Q.enqueue(data[i])

        const start = Math.max(0, i - capacity + 1)
        expect(Array.from(Q)).toEqual(data.slice(start, i + 1))
      }

      Q.clear()
      expect(Array.from(Q)).toEqual([])
      for (let i = 0; i < SIZE; ++i) {
        Q.unshift(data[i])

        const start = Math.max(0, i - capacity + 1)
        expect(Array.from(Q)).toEqual(data.slice(start, i + 1).reverse())
      }
    })

    it('iterator', function () {
      const Q = new CircularQueue<number>({ autoResize: false })
      Q.resize(5)

      Q.enqueue(0)
      Q.enqueue(1)
      Q.enqueue(2)
      Q.enqueues([3, 4])
      expect(Array.from(Q)).toEqual([0, 1, 2, 3, 4])

      Q.enqueue(5)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      Q.enqueues([6, 7, 8, 9])
      expect(Array.from(Q)).toEqual([5, 6, 7, 8, 9])
    })

    it('init', function () {
      const Q = new CircularQueue<number>({ capacity: 5, autoResize: false })

      Q.init()
      expect(Array.from(Q)).toEqual([])

      Q.init([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      Q.enqueue(6)
      expect(Array.from(Q)).toEqual([2, 3, 4, 5, 6])
      expect(Q.size).toEqual(5)

      Q.init()
      expect(Array.from(Q)).toEqual([])

      Q.init([1, 2, 3, 4, 5, 6])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6])
      expect(Q.size).toEqual(6)

      Q.init([1, 2, 3])
      expect(Array.from(Q)).toEqual([1, 2, 3])

      Q.init([2, 3, 4, 5, 6, 7])
      expect(Array.from(Q)).toEqual([2, 3, 4, 5, 6, 7])

      Q.init([2, 4], -1, 3)
      expect(Array.from(Q)).toEqual([2, 4])

      Q.init([3, 4, 5], -1, 2)
      expect(Array.from(Q)).toEqual([3, 4])

      Q.init([7, 8, 9], 1, 4)
      expect(Array.from(Q)).toEqual([8, 9])

      Q.init([7, 8, 9], 2, 2)
      expect(Array.from(Q)).toEqual([])

      Q.init([7, 8, 9], 2, 1)
      expect(Array.from(Q)).toEqual([])

      Q.init([7, 8, 9], 4, 7)
      expect(Array.from(Q)).toEqual([])
    })

    it('resize', function () {
      const Q = new CircularQueue<number>({ autoResize: false })

      Q.resize(5)
      Q.enqueues([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      Q.enqueue(3)
      Q.enqueue(7)
      expect(Array.from(Q)).toEqual([3, 4, 5, 3, 7])

      Q.resize(7)
      Q.enqueue(5)
      Q.enqueue(6)
      expect(Array.from(Q)).toEqual([3, 4, 5, 3, 7, 5, 6])

      Q.enqueue(9)
      expect(Array.from(Q)).toEqual([4, 5, 3, 7, 5, 6, 9])

      Q.enqueues([3, 4])
      expect(Array.from(Q)).toEqual([3, 7, 5, 6, 9, 3, 4])

      expect(() => Q.resize(5)).toThrow(RangeError)
    })

    it('enqueue', function () {
      const Q = new CircularQueue<number>({ autoResize: false })
      Q.resize(3)

      Q.enqueues([1, 2, 3])
      expect(Array.from(Q)).toEqual([1, 2, 3])

      Q.enqueues([4, 5, 6])
      expect(Array.from(Q)).toEqual([4, 5, 6])

      Q.enqueues([7, 8, 9, 10])
      expect(Array.from(Q)).toEqual([8, 9, 10])

      Q.enqueues([11, 12])
      expect(Array.from(Q)).toEqual([10, 11, 12])

      Q.enqueue(13)
      expect(Array.from(Q)).toEqual([11, 12, 13])

      Q.enqueue(14)
      expect(Array.from(Q)).toEqual([12, 13, 14])

      Q.enqueues([15])
      expect(Array.from(Q)).toEqual([13, 14, 15])

      Q.enqueues([16, 17])
      expect(Array.from(Q)).toEqual([15, 16, 17])
      expect(Q.size).toEqual(3)

      Q.enqueues([18, 19], 2, 1)
      expect(Array.from(Q)).toEqual([15, 16, 17])
      expect(Q.size).toEqual(3)

      Q.enqueues([18, 19], 2, 2)
      expect(Array.from(Q)).toEqual([15, 16, 17])
      expect(Q.size).toEqual(3)

      Q.enqueues([18, 19], 2, 5)
      expect(Array.from(Q)).toEqual([15, 16, 17])
      expect(Q.size).toEqual(3)

      Q.enqueues([18, 19], 1, 5)
      expect(Array.from(Q)).toEqual([16, 17, 19])
      expect(Q.size).toEqual(3)

      Q.enqueues([20, 21, 22], -1, 2)
      expect(Array.from(Q)).toEqual([19, 20, 21])
      expect(Q.size).toEqual(3)
    })

    it('unshift', function () {
      const Q = new CircularQueue<number>({ autoResize: false })
      Q.resize(3)

      Q.unshift(1)
      Q.unshift(2)
      Q.unshift(3)
      expect(Array.from(Q)).toEqual([3, 2, 1])

      Q.unshift(4)
      expect(Array.from(Q)).toEqual([4, 3, 2])

      Q.enqueue(5)
      expect(Array.from(Q)).toEqual([3, 2, 5])

      Q.unshift(6)
      expect(Array.from(Q)).toEqual([6, 3, 2])

      Q.enqueues([7, 8])
      expect(Array.from(Q)).toEqual([2, 7, 8])

      Q.enqueues([9, 10, 11])
      expect(Array.from(Q)).toEqual([9, 10, 11])

      Q.unshift(12)
      expect(Array.from(Q)).toEqual([12, 9, 10])

      Q.enqueue(13)
      expect(Array.from(Q)).toEqual([9, 10, 13])
      expect(Q.size).toEqual(3)
    })

    it('dequeue', function () {
      const Q = new CircularQueue<number>({ autoResize: false })

      Q.resize(5)
      Q.enqueues([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      expect(Q.dequeue()).toEqual(1)
      expect(Array.from(Q)).toEqual([2, 3, 4, 5])

      expect(Q.dequeue()).toEqual(2)
      expect(Array.from(Q)).toEqual([3, 4, 5])

      expect(Q.dequeue()).toEqual(3)
      expect(Array.from(Q)).toEqual([4, 5])

      expect(Q.dequeue()).toEqual(4)
      expect(Array.from(Q)).toEqual([5])

      expect(Q.dequeue()).toEqual(5)
      expect(Array.from(Q)).toEqual([])

      expect(Q.dequeue()).toEqual(undefined)
      expect(Array.from(Q)).toEqual([])

      expect(Q.dequeue(1)).toEqual(undefined)
      expect(Array.from(Q)).toEqual([1])

      expect(Q.dequeue(-9)).toEqual(1)
      expect(Array.from(Q)).toEqual([-9])
    })

    it('splice', function () {
      const Q = new CircularQueue<number>({ capacity: 5, autoResize: false })

      Q.init([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])
      expect(Q.size).toEqual(5)

      Q.splice(x => x > 3)
      expect(Array.from(Q)).toEqual([4, 5])
      expect(Q.size).toEqual(2)

      Q.enqueues([6, 7, 8, 9])
      expect(Array.from(Q)).toEqual([5, 6, 7, 8, 9])
      expect(Q.size).toEqual(5)

      Q.splice(x => x < 7, [10, 11])
      expect(Array.from(Q)).toEqual([5, 6, 10, 11])
      expect(Q.size).toEqual(4)

      Q.unshift(12)
      Q.unshift(13)
      Q.unshift(14)
      Q.unshift(15)
      expect(Array.from(Q)).toEqual([15, 14, 13, 12, 5])
      expect(Q.size).toEqual(5)

      Q.splice(x => Boolean(x & 1), [16, 17, 18], 2, 7)
      expect(Array.from(Q)).toEqual([15, 13, 5, 18])
      expect(Q.size).toEqual(4)
    })

    it('front / back / pop / dequeue / enqueue / unshift', function () {
      const Q = new CircularQueue<number>({ autoResize: false })

      Q.resize(7)
      Q.enqueues([1, 2, 3])
      expect(Array.from(Q)).toEqual([1, 2, 3])
      expect(Q.front()).toEqual(1)
      expect(Q.back()).toEqual(3)

      Q.unshift(4)
      Q.unshift(5)
      Q.unshift(6)
      expect(Array.from(Q)).toEqual([6, 5, 4, 1, 2, 3])
      expect(Q.front()).toEqual(6)
      expect(Q.back()).toEqual(3)

      Q.enqueue(7)
      Q.enqueue(8)
      expect(Array.from(Q)).toEqual([5, 4, 1, 2, 3, 7, 8])
      expect(Q.front()).toEqual(5)
      expect(Q.back()).toEqual(8)

      Q.unshift(9)
      Q.unshift(10)
      expect(Array.from(Q)).toEqual([10, 9, 5, 4, 1, 2, 3])
      expect(Q.front()).toEqual(10)
      expect(Q.back()).toEqual(3)

      expect(Q.pop()).toEqual(3)
      expect(Array.from(Q)).toEqual([10, 9, 5, 4, 1, 2])
      expect(Q.front()).toEqual(10)
      expect(Q.back()).toEqual(2)

      Q.dequeue()
      expect(Array.from(Q)).toEqual([9, 5, 4, 1, 2])
      expect(Q.front()).toEqual(9)
      expect(Q.back()).toEqual(2)

      Q.clear()
      expect(Array.from(Q)).toEqual([])
      expect(Q.size).toEqual(0)
      expect(Q.front()).toEqual(undefined)
      expect(Q.back()).toEqual(undefined)

      Q.enqueue(11)
      expect(Array.from(Q)).toEqual([11])
      expect(Q.front()).toEqual(11)
      expect(Q.back()).toEqual(11)

      Q.dequeue()
      expect(Array.from(Q)).toEqual([])
      expect(Q.size).toEqual(0)
      expect(Q.front()).toEqual(undefined)
      expect(Q.back()).toEqual(undefined)

      Q.unshift(12)
      expect(Array.from(Q)).toEqual([12])
      expect(Q.front()).toEqual(12)
      expect(Q.back()).toEqual(12)

      Q.dequeue(13)
      expect(Array.from(Q)).toEqual([13])
      expect(Q.front()).toEqual(13)
      expect(Q.back()).toEqual(13)

      Q.enqueue(14)
      expect(Array.from(Q)).toEqual([13, 14])
      expect(Q.front()).toEqual(13)
      expect(Q.back()).toEqual(14)

      Q.unshift(15)
      expect(Array.from(Q)).toEqual([15, 13, 14])
      expect(Q.front()).toEqual(15)
      expect(Q.back()).toEqual(14)

      Q.clear()
      expect(Array.from(Q)).toEqual([])
      expect(Q.pop()).toEqual(undefined)
    })

    it('rearrange', function () {
      const Q = new CircularQueue<number>({ autoResize: false })
      Q.resize(5)

      Q.enqueues([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      Q.enqueue(6)
      expect(Array.from(Q)).toEqual([2, 3, 4, 5, 6])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([2, 3, 4, 5, 6])

      Q.unshift(7)
      expect(Array.from(Q)).toEqual([7, 2, 3, 4, 5])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([7, 2, 3, 4, 5])

      Q.enqueues([8, 9])
      expect(Array.from(Q)).toEqual([3, 4, 5, 8, 9])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([3, 4, 5, 8, 9])

      Q.unshift(10)
      expect(Array.from(Q)).toEqual([10, 3, 4, 5, 8])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([10, 3, 4, 5, 8])

      Q.unshift(11)
      expect(Array.from(Q)).toEqual([11, 10, 3, 4, 5])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([11, 10, 3, 4, 5])

      Q.pop()
      expect(Array.from(Q)).toEqual([11, 10, 3, 4])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([11, 10, 3, 4])

      Q.dequeue()
      expect(Array.from(Q)).toEqual([10, 3, 4])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([10, 3, 4])

      Q.dequeue(12)
      expect(Array.from(Q)).toEqual([3, 4, 12])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([3, 4, 12])
    })
  })

  describe('auto-resize', function () {
    it('basic', function () {
      const SIZE = 1000
      const data = new Array(SIZE).fill(0).map((_x, i) => i)
      const capacity = 7
      const Q = new CircularQueue<number>({ autoResize: true, capacity })

      for (let i = 0; i < SIZE; ++i) {
        Q.enqueue(data[i])

        const start = 0
        expect(Array.from(Q)).toEqual(data.slice(start, i + 1))
      }

      Q.clear()
      expect(Array.from(Q)).toEqual([])
      for (let i = 0; i < SIZE; ++i) {
        Q.unshift(data[i])

        const start = 0
        expect(Array.from(Q)).toEqual(data.slice(start, i + 1).reverse())
      }
    })

    it('iterator -- autoResize', function () {
      const Q = new CircularQueue<number>({ autoResize: true })
      Q.resize(5)

      Q.enqueue(0)
      Q.enqueue(1)
      Q.enqueue(2)
      Q.enqueues([3, 4])
      expect(Array.from(Q)).toEqual([0, 1, 2, 3, 4])

      Q.enqueue(5)
      expect(Array.from(Q)).toEqual([0, 1, 2, 3, 4, 5])

      Q.enqueues([6, 7, 8, 9])
      expect(Array.from(Q)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    })

    it('init', function () {
      const Q = new CircularQueue<number>({ capacity: 5, autoResize: true })

      Q.init()
      expect(Array.from(Q)).toEqual([])

      Q.init([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      Q.enqueue(6)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6])
      expect(Q.size).toEqual(6)

      Q.init()
      expect(Array.from(Q)).toEqual([])

      Q.init([1, 2, 3, 4, 5, 6])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6])
      expect(Q.size).toEqual(6)

      Q.init([1, 2, 3])
      expect(Array.from(Q)).toEqual([1, 2, 3])

      Q.init([2, 3, 4, 5, 6, 7])
      expect(Array.from(Q)).toEqual([2, 3, 4, 5, 6, 7])

      Q.init([2, 4], -1, 3)
      expect(Array.from(Q)).toEqual([2, 4])

      Q.init([3, 4, 5], -1, 2)
      expect(Array.from(Q)).toEqual([3, 4])

      Q.init([7, 8, 9], 1, 4)
      expect(Array.from(Q)).toEqual([8, 9])

      Q.init([7, 8, 9], 2, 2)
      expect(Array.from(Q)).toEqual([])

      Q.init([7, 8, 9], 2, 1)
      expect(Array.from(Q)).toEqual([])

      Q.init([7, 8, 9], 4, 7)
      expect(Array.from(Q)).toEqual([])
    })

    it('resize', function () {
      const Q = new CircularQueue<number>({ autoResize: true })

      Q.resize(5)
      Q.enqueues([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      Q.enqueue(3)
      Q.enqueue(7)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 3, 7])

      Q.resize(7)
      Q.enqueue(5)
      Q.enqueue(6)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 3, 7, 5, 6])

      Q.enqueue(9)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 3, 7, 5, 6, 9])

      Q.enqueues([3, 4])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 3, 7, 5, 6, 9, 3, 4])

      expect(() => Q.resize(5)).toThrow(RangeError)
    })

    it('enqueue', function () {
      const Q = new CircularQueue<number>({ autoResize: true })
      Q.resize(3)

      Q.enqueues([1, 2, 3])
      expect(Array.from(Q)).toEqual([1, 2, 3])

      Q.enqueues([4, 5, 6])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6])

      Q.enqueues([7, 8, 9, 10])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

      Q.enqueues([11, 12])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

      Q.enqueue(13)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])

      Q.enqueue(14)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

      Q.enqueues([15])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

      Q.enqueues([16, 17])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
      expect(Q.size).toEqual(17)

      Q.enqueues([18, 19], 2, 1)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
      expect(Q.size).toEqual(17)

      Q.enqueues([18, 19], 2, 2)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
      expect(Q.size).toEqual(17)

      Q.enqueues([18, 19], 2, 5)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
      expect(Q.size).toEqual(17)

      Q.enqueues([18, 19], 1, 5)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19])
      expect(Q.size).toEqual(18)

      Q.enqueues([20, 21, 22], -1, 2)
      expect(Array.from(Q)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21,
      ])
      expect(Q.size).toEqual(20)
    })

    it('unshift', function () {
      const Q = new CircularQueue<number>({ autoResize: true })
      Q.resize(3)

      Q.unshift(1)
      Q.unshift(2)
      Q.unshift(3)
      expect(Array.from(Q)).toEqual([3, 2, 1])

      Q.unshift(4)
      expect(Array.from(Q)).toEqual([4, 3, 2, 1])

      Q.enqueue(5)
      expect(Array.from(Q)).toEqual([4, 3, 2, 1, 5])

      Q.unshift(6)
      expect(Array.from(Q)).toEqual([6, 4, 3, 2, 1, 5])

      Q.enqueues([7, 8])
      expect(Array.from(Q)).toEqual([6, 4, 3, 2, 1, 5, 7, 8])

      Q.enqueues([9, 10, 11])
      expect(Array.from(Q)).toEqual([6, 4, 3, 2, 1, 5, 7, 8, 9, 10, 11])

      Q.unshift(12)
      expect(Array.from(Q)).toEqual([12, 6, 4, 3, 2, 1, 5, 7, 8, 9, 10, 11])

      Q.enqueue(13)
      expect(Array.from(Q)).toEqual([12, 6, 4, 3, 2, 1, 5, 7, 8, 9, 10, 11, 13])
      expect(Q.size).toEqual(13)
    })

    it('dequeue', function () {
      const Q = new CircularQueue<number>({ autoResize: true })

      Q.resize(5)
      Q.enqueues([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      expect(Q.dequeue()).toEqual(1)
      expect(Array.from(Q)).toEqual([2, 3, 4, 5])

      expect(Q.dequeue()).toEqual(2)
      expect(Array.from(Q)).toEqual([3, 4, 5])

      expect(Q.dequeue()).toEqual(3)
      expect(Array.from(Q)).toEqual([4, 5])

      expect(Q.dequeue()).toEqual(4)
      expect(Array.from(Q)).toEqual([5])

      expect(Q.dequeue()).toEqual(5)
      expect(Array.from(Q)).toEqual([])

      expect(Q.dequeue()).toEqual(undefined)
      expect(Array.from(Q)).toEqual([])

      expect(Q.dequeue(1)).toEqual(undefined)
      expect(Array.from(Q)).toEqual([1])

      expect(Q.dequeue(-9)).toEqual(1)
      expect(Array.from(Q)).toEqual([-9])
    })

    it('splice', function () {
      const Q = new CircularQueue<number>({ capacity: 5, autoResize: true })

      Q.init([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])
      expect(Q.size).toEqual(5)

      Q.splice(x => x > 3)
      expect(Array.from(Q)).toEqual([4, 5])
      expect(Q.size).toEqual(2)

      Q.enqueues([6, 7, 8, 9])
      expect(Array.from(Q)).toEqual([4, 5, 6, 7, 8, 9])
      expect(Q.size).toEqual(6)

      Q.splice(x => x < 7, [10, 11])
      expect(Array.from(Q)).toEqual([4, 5, 6, 10, 11])
      expect(Q.size).toEqual(5)

      Q.unshift(12)
      Q.unshift(13)
      Q.unshift(14)
      Q.unshift(15)
      expect(Array.from(Q)).toEqual([15, 14, 13, 12, 4, 5, 6, 10, 11])
      expect(Q.size).toEqual(9)

      Q.splice(x => Boolean(x & 1), [16, 17, 18], 2, 7)
      expect(Array.from(Q)).toEqual([15, 13, 5, 11, 18])
      expect(Q.size).toEqual(5)
    })

    it('front / back / pop / dequeue / enqueue / unshift', function () {
      const Q = new CircularQueue<number>({ autoResize: true })

      Q.resize(7)
      Q.enqueues([1, 2, 3])
      expect(Array.from(Q)).toEqual([1, 2, 3])
      expect(Q.front()).toEqual(1)
      expect(Q.back()).toEqual(3)

      Q.unshift(4)
      Q.unshift(5)
      Q.unshift(6)
      expect(Array.from(Q)).toEqual([6, 5, 4, 1, 2, 3])
      expect(Q.front()).toEqual(6)
      expect(Q.back()).toEqual(3)

      Q.enqueue(7)
      Q.enqueue(8)
      expect(Array.from(Q)).toEqual([6, 5, 4, 1, 2, 3, 7, 8])
      expect(Q.front()).toEqual(6)
      expect(Q.back()).toEqual(8)

      Q.unshift(9)
      Q.unshift(10)
      expect(Array.from(Q)).toEqual([10, 9, 6, 5, 4, 1, 2, 3, 7, 8])
      expect(Q.front()).toEqual(10)
      expect(Q.back()).toEqual(8)

      expect(Q.pop()).toEqual(8)
      expect(Array.from(Q)).toEqual([10, 9, 6, 5, 4, 1, 2, 3, 7])
      expect(Q.front()).toEqual(10)
      expect(Q.back()).toEqual(7)

      Q.dequeue()
      expect(Array.from(Q)).toEqual([9, 6, 5, 4, 1, 2, 3, 7])
      expect(Q.front()).toEqual(9)
      expect(Q.back()).toEqual(7)

      Q.clear()
      expect(Array.from(Q)).toEqual([])
      expect(Q.size).toEqual(0)
      expect(Q.front()).toEqual(undefined)
      expect(Q.back()).toEqual(undefined)

      Q.enqueue(11)
      expect(Array.from(Q)).toEqual([11])
      expect(Q.front()).toEqual(11)
      expect(Q.back()).toEqual(11)

      Q.dequeue()
      expect(Array.from(Q)).toEqual([])
      expect(Q.size).toEqual(0)
      expect(Q.front()).toEqual(undefined)
      expect(Q.back()).toEqual(undefined)

      Q.unshift(12)
      expect(Array.from(Q)).toEqual([12])
      expect(Q.front()).toEqual(12)
      expect(Q.back()).toEqual(12)

      Q.dequeue(13)
      expect(Array.from(Q)).toEqual([13])
      expect(Q.front()).toEqual(13)
      expect(Q.back()).toEqual(13)

      Q.enqueue(14)
      expect(Array.from(Q)).toEqual([13, 14])
      expect(Q.front()).toEqual(13)
      expect(Q.back()).toEqual(14)

      Q.unshift(15)
      expect(Array.from(Q)).toEqual([15, 13, 14])
      expect(Q.front()).toEqual(15)
      expect(Q.back()).toEqual(14)

      Q.clear()
      expect(Array.from(Q)).toEqual([])
      expect(Q.pop()).toEqual(undefined)
    })

    it('rearrange', function () {
      const Q = new CircularQueue<number>({ autoResize: true })
      Q.resize(5)

      Q.enqueues([1, 2, 3, 4, 5])
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5])

      Q.enqueue(6)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([1, 2, 3, 4, 5, 6])

      Q.unshift(7)
      expect(Array.from(Q)).toEqual([7, 1, 2, 3, 4, 5, 6])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([7, 1, 2, 3, 4, 5, 6])

      Q.enqueues([8, 9])
      expect(Array.from(Q)).toEqual([7, 1, 2, 3, 4, 5, 6, 8, 9])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([7, 1, 2, 3, 4, 5, 6, 8, 9])

      Q.unshift(10)
      expect(Array.from(Q)).toEqual([10, 7, 1, 2, 3, 4, 5, 6, 8, 9])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([10, 7, 1, 2, 3, 4, 5, 6, 8, 9])

      Q.unshift(11)
      expect(Array.from(Q)).toEqual([11, 10, 7, 1, 2, 3, 4, 5, 6, 8, 9])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([11, 10, 7, 1, 2, 3, 4, 5, 6, 8, 9])

      Q.pop()
      expect(Array.from(Q)).toEqual([11, 10, 7, 1, 2, 3, 4, 5, 6, 8])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([11, 10, 7, 1, 2, 3, 4, 5, 6, 8])

      Q.dequeue()
      expect(Array.from(Q)).toEqual([10, 7, 1, 2, 3, 4, 5, 6, 8])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([10, 7, 1, 2, 3, 4, 5, 6, 8])

      Q.dequeue(12)
      expect(Array.from(Q)).toEqual([7, 1, 2, 3, 4, 5, 6, 8, 12])
      Q.rearrange()
      expect(Array.from(Q)).toEqual([7, 1, 2, 3, 4, 5, 6, 8, 12])
    })
  })

  describe('edge', function () {
    it('constructor', function () {
      expect(() => new CircularQueue({ capacity: -1 })).toThrow(RangeError)
      expect(() => new CircularQueue({ autoResizeExpansionRatio: 1.1 })).toThrow(RangeError)
      expect(() => new CircularQueue({ autoResize: true, autoResizeExpansionRatio: 1.1 })).toThrow(
        RangeError,
      )
      expect(
        () => new CircularQueue({ autoResize: false, autoResizeExpansionRatio: 1.1 }),
      ).not.toThrow(RangeError)
    })

    it('destroy', function () {
      const Q = new CircularQueue<number>()
      Q.resize(5)

      Q.init([1, 2, 3])
      expect(Array.from(Q)).toEqual([1, 2, 3])

      Q.enqueue(4)
      expect(Array.from(Q)).toEqual([1, 2, 3, 4])

      Q.destroy()
      expect(() => Q.enqueue(5)).toThrow(/Cannot set properties of null/)
      expect(() => Q.enqueues([5])).toThrow(/Cannot set properties of null/)
      expect(() => Q.unshift(5)).toThrow(/Cannot set properties of null/)
    })
  })
})
