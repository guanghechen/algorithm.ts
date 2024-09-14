import type { IHistory } from '../src'
import { History } from '../src'

describe('CircularHistory', function () {
  let history: IHistory<number>

  beforeEach(() => {
    history = new History<number>({ name: 'demo', capacity: 4 })
  })

  it('constructor', () => {
    expect(() => new History({ name: 'demo', capacity: 0 })).toThrow(
      'capacity is expected to be a positive integer',
    )
    expect(() => new History({ name: 'demo', capacity: -1 })).toThrow(
      'capacity is expected to be a positive integer',
    )
    expect(() => new History({ name: 'demo', capacity: 1.2 })).toThrow(
      'capacity is expected to be a positive integer',
    )
    expect(() => new History({ name: 'demo', capacity: 1 })).not.toThrow()
  })

  it('backward/forward', () => {
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.top()).toEqual(undefined)

    history.backward()
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.top()).toEqual(undefined)

    history.forward()
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.top()).toEqual(undefined)

    history.push(1).push(2).push(3)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.backward()).toEqual([2, false])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([1, true])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([1, true])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.forward()).toEqual([2, false])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.forward()).toEqual([3, true])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.forward()).toEqual([3, true])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.push(4)
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([4, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.backward()).toEqual([3, false])
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([2, false])
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([1, true])
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([1, true])
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.forward()).toEqual([2, false])
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.forward()).toEqual([3, false])
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.forward()).toEqual([4, true])
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([4, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.forward()).toEqual([4, true])
    expect(Array.from(history)).toEqual([4, 3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([4, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.push(5)
    expect(Array.from(history)).toEqual([5, 4, 3, 2])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(5)
    expect(history.present()).toEqual([5, 3])
    expect(history.isTop()).toEqual(true)
    expect(history.isBot()).toEqual(false)

    history.push(6)
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([6, 3])
    expect(history.isTop()).toEqual(true)
    expect(history.isBot()).toEqual(false)

    expect(history.backward()).toEqual([5, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([5, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([4, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([4, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([3, true])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([3, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([3, true])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([3, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.forward()).toEqual([4, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([4, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.forward()).toEqual([5, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([5, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.forward()).toEqual([6, true])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([6, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.forward()).toEqual([6, true])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([6, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.backward(2)).toEqual([4, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([4, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward(2)).toEqual([3, true])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([3, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.forward(2)).toEqual([5, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([5, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.forward(2)).toEqual([6, true])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([6, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.forward(-2)).toEqual([4, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([4, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.forward(-1)).toEqual([3, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([3, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.forward(-1)).toEqual([3, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([3, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    expect(history.backward(-2)).toEqual([5, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([5, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward(-1)).toEqual([6, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([6, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.backward(-1)).toEqual([6, false])
    expect(Array.from(history)).toEqual([6, 5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([6, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)
  })

  it('clear', () => {
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.clear()
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(1)
    expect(Array.from(history)).toEqual([1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(1)
    expect(history.top()).toEqual(1)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.clear()
    expect(Array.from(history)).toEqual([1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(1)
    expect(history.top()).toEqual(1)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(2)
    expect(Array.from(history)).toEqual([2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(2)
    expect(history.top()).toEqual(2)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.clear()
    expect(Array.from(history)).toEqual([2])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(1)
    expect(history.top()).toEqual(2)
    expect(history.present()).toEqual([2, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(3).push(4)
    expect(Array.from(history)).toEqual([4, 3, 2])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([4, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.push(5)
    expect(Array.from(history)).toEqual([5, 4, 3, 2])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(5)
    expect(history.present()).toEqual([5, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.clear()
    expect(Array.from(history)).toEqual([5])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(1)
    expect(history.top()).toEqual(5)
    expect(history.present()).toEqual([5, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)
  })

  it('count', () => {
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(1).push(2).push(3)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.count(x => (x & 1) === 0)).toEqual(1)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.count(x => (x & 1) === 1)).toEqual(2)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)
  })

  it('fork', () => {
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    const history2 = history.fork('alice')
    expect(history2.name).toEqual('alice')
    expect(Array.from(history2)).toEqual([])
    expect(history2.capacity).toEqual(4)
    expect(history2.size).toEqual(0)
    expect(history2.top()).toEqual(undefined)
    expect(history2.present()).toEqual([undefined, -1])
    expect(history2.isBot()).toEqual(true)
    expect(history2.isTop()).toEqual(true)

    history.push(1).push(2)
    expect(Array.from(history)).toEqual([2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(2)
    expect(history.top()).toEqual(2)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(Array.from(history2)).toEqual([])
    expect(history2.capacity).toEqual(4)
    expect(history2.size).toEqual(0)
    expect(history2.top()).toEqual(undefined)
    expect(history2.present()).toEqual([undefined, -1])
    expect(history2.isBot()).toEqual(true)
    expect(history2.isTop()).toEqual(true)

    const history3 = history.fork('bob')
    expect(history3.name).toEqual('bob')
    expect(Array.from(history3)).toEqual([2, 1])
    expect(history3.capacity).toEqual(4)
    expect(history3.size).toEqual(2)
    expect(history3.top()).toEqual(2)
    expect(history3.present()).toEqual([2, 1])
    expect(history3.isBot()).toEqual(false)
    expect(history3.isTop()).toEqual(true)
  })

  it('go', () => {
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.go(2)
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.go(-2)
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(1).push(2).push(3)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.go(1)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    history.go(0)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    history.go(3)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.go(-1)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    history.go(2)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)
  })

  it('push', () => {
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(1)
    expect(Array.from(history)).toEqual([1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(1)
    expect(history.top()).toEqual(1)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(2)
    expect(Array.from(history)).toEqual([2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(2)
    expect(history.top()).toEqual(2)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.push(2)
    expect(Array.from(history)).toEqual([2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(2)
    expect(history.top()).toEqual(2)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.push(3)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.backward()).toEqual([2, false])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([1, true])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    history.push(1)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    history.push(2)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    history.push(3)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    expect(history.backward()).toEqual([2, false])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([2, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(false)

    expect(history.backward()).toEqual([1, true])
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(false)

    history.push(4)
    expect(Array.from(history)).toEqual([4, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(2)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([4, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)
  })

  it('rearrange', () => {
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.rearrange(() => true)
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.rearrange(() => false)
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(1).push(2).push(3)
    expect(Array.from(history)).toEqual([3, 2, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.rearrange(x => x % 2 == 1)
    expect(Array.from(history)).toEqual([3, 1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(2)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 1])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.rearrange(x => x > 1)
    expect(Array.from(history)).toEqual([3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(1)
    expect(history.top()).toEqual(3)
    expect(history.present()).toEqual([3, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(4).push(5)
    expect(Array.from(history)).toEqual([5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(5)
    expect(history.present()).toEqual([5, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.rearrange(() => true)
    expect(Array.from(history)).toEqual([5, 4, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(3)
    expect(history.top()).toEqual(5)
    expect(history.present()).toEqual([5, 2])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.rearrange(() => false)
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)
  })

  it('updateTop', () => {
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.updateTop(1)
    expect(Array.from(history)).toEqual([])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(0)
    expect(history.top()).toEqual(undefined)
    expect(history.present()).toEqual([undefined, -1])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(1)
    expect(Array.from(history)).toEqual([1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(1)
    expect(history.top()).toEqual(1)
    expect(history.present()).toEqual([1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.updateTop(-1)
    expect(Array.from(history)).toEqual([-1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(1)
    expect(history.top()).toEqual(-1)
    expect(history.present()).toEqual([-1, 0])
    expect(history.isBot()).toEqual(true)
    expect(history.isTop()).toEqual(true)

    history.push(2).push(3).push(4)
    expect(Array.from(history)).toEqual([4, 3, 2, -1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(4)
    expect(history.present()).toEqual([4, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.updateTop(-2)
    expect(Array.from(history)).toEqual([-2, 3, 2, -1])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(-2)
    expect(history.present()).toEqual([-2, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.push(5).push(6)
    expect(Array.from(history)).toEqual([6, 5, -2, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(6)
    expect(history.present()).toEqual([6, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)

    history.updateTop(-3)
    expect(Array.from(history)).toEqual([-3, 5, -2, 3])
    expect(history.capacity).toEqual(4)
    expect(history.size).toEqual(4)
    expect(history.top()).toEqual(-3)
    expect(history.present()).toEqual([-3, 3])
    expect(history.isBot()).toEqual(false)
    expect(history.isTop()).toEqual(true)
  })
})
