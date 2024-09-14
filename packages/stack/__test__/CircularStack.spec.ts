import type { ICircularStack } from '../src'
import { CircularStack } from '../src'

describe('CircularStack', function () {
  let stack: ICircularStack<number>

  beforeEach(() => {
    stack = new CircularStack<number>({ capacity: 4 })
  })

  it('constructor', () => {
    expect(() => new CircularStack({ capacity: 0 })).toThrow(
      'capacity is expected to be a positive integer',
    )
    expect(() => new CircularStack({ capacity: -1 })).toThrow(
      'capacity is expected to be a positive integer',
    )
    expect(() => new CircularStack({ capacity: 1.2 })).toThrow(
      'capacity is expected to be a positive integer',
    )
    expect(() => new CircularStack({ capacity: 1 })).not.toThrow()
  })

  it('at', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])
    expect(stack.at(0)).toEqual(undefined)

    stack.push(1).push(2).push(3).push(4)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.at(-1)).toEqual(undefined)
    expect(stack.at(0)).toEqual(1)
    expect(stack.at(1)).toEqual(2)
    expect(stack.at(2)).toEqual(3)
    expect(stack.at(3)).toEqual(4)
    expect(stack.at(4)).toEqual(undefined)
    expect(Array.from(stack)).toEqual([4, 3, 2, 1])

    stack.push(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.at(-1)).toEqual(undefined)
    expect(stack.at(0)).toEqual(2)
    expect(stack.at(1)).toEqual(3)
    expect(stack.at(2)).toEqual(4)
    expect(stack.at(3)).toEqual(5)
    expect(stack.at(4)).toEqual(undefined)
    expect(Array.from(stack)).toEqual([5, 4, 3, 2])
  })

  it('consuming', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])
    expect(Array.from(stack.consuming())).toEqual([])
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(1).push(2).push(3).push(4)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([4, 3, 2, 1])
    expect(Array.from(stack.consuming())).toEqual([4, 3, 2, 1])
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(5)
    stack.push(6)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([6, 5])
    const consumer = stack.consuming()

    expect(consumer.next().value).toEqual(6)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(1)
    expect(Array.from(stack)).toEqual([5])

    stack.push(7).push(8)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(3)
    expect(Array.from(stack)).toEqual([8, 7, 5])

    expect(consumer.next().value).toEqual(8)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([7, 5])

    expect(consumer.next().value).toEqual(7)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(1)
    expect(Array.from(stack)).toEqual([5])

    expect(consumer.next().value).toEqual(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    expect(consumer.next().done).toEqual(true)
    expect(consumer.next().value).toEqual(undefined)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])
  })

  it('count', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])
    expect(stack.count(() => true)).toEqual(0)

    stack.push(1).push(2).push(3).push(4)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([4, 3, 2, 1])
    expect(stack.count(element => element % 2 === 0)).toEqual(2)
    expect(stack.count(element => element % 2 !== 0)).toEqual(2)
    expect(stack.count(() => true)).toEqual(4)
    expect(stack.count(() => false)).toEqual(0)

    stack.push(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([5, 4, 3, 2])
    expect(stack.count(element => element % 2 === 0)).toEqual(2)
    expect(stack.count(element => element % 2 !== 0)).toEqual(2)
    expect(stack.count(() => true)).toEqual(4)
    expect(stack.count(() => false)).toEqual(0)

    expect(stack.pop()).toEqual(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(3)
    expect(Array.from(stack)).toEqual([4, 3, 2])
    expect(stack.count(element => element % 2 === 0)).toEqual(2)
    expect(stack.count(element => element % 2 !== 0)).toEqual(1)
    expect(stack.count(() => true)).toEqual(3)
    expect(stack.count(() => false)).toEqual(0)
  })

  it('fork', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    const stack1 = stack.fork()
    expect(stack1.size).toEqual(0)
    expect(Array.from(stack1)).toEqual([])

    stack.push(1)
    const stack2 = stack.fork()
    expect(stack2.size).toEqual(1)
    expect(Array.from(stack2)).toEqual([1])

    stack.push(2)
    const stack3 = stack.fork()
    expect(stack1.size).toEqual(0)
    expect(Array.from(stack1)).toEqual([])
    expect(stack2.size).toEqual(1)
    expect(Array.from(stack2)).toEqual([1])
    expect(stack3.size).toEqual(2)
    expect(Array.from(stack3)).toEqual([2, 1])

    stack.push(3).push(4).push(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([5, 4, 3, 2])

    const stack4 = stack.fork()
    expect(stack4.capacity).toEqual(4)
    expect(stack4.size).toEqual(4)
    expect(Array.from(stack4)).toEqual([5, 4, 3, 2])

    stack.push(6)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([6, 5, 4, 3])

    expect(stack4.capacity).toEqual(4)
    expect(stack4.size).toEqual(4)
    expect(Array.from(stack4)).toEqual([5, 4, 3, 2])

    const stack5 = stack.fork()
    expect(stack4.capacity).toEqual(4)
    expect(stack4.size).toEqual(4)
    expect(Array.from(stack4)).toEqual([5, 4, 3, 2])
    expect(stack5.capacity).toEqual(4)
    expect(stack5.size).toEqual(4)
    expect(Array.from(stack5)).toEqual([6, 5, 4, 3])
  })

  it('pop', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    expect(stack.pop()).toEqual(undefined)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(1).push(2).push(3).push(4).push(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([5, 4, 3, 2])

    expect(stack.pop()).toEqual(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(3)
    expect(Array.from(stack)).toEqual([4, 3, 2])

    expect(stack.pop()).toEqual(4)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([3, 2])

    stack.push(6)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(3)
    expect(Array.from(stack)).toEqual([6, 3, 2])

    expect(stack.pop()).toEqual(6)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([3, 2])

    expect(stack.pop()).toEqual(3)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(1)
    expect(Array.from(stack)).toEqual([2])

    stack.push(7).push(8).push(9).push(10)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([10, 9, 8, 7])

    expect(stack.pop()).toEqual(10)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(3)
    expect(Array.from(stack)).toEqual([9, 8, 7])

    expect(stack.pop()).toEqual(9)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([8, 7])

    expect(stack.pop()).toEqual(8)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(1)
    expect(Array.from(stack)).toEqual([7])

    expect(stack.pop()).toEqual(7)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    expect(stack.pop()).toEqual(undefined)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    expect(stack.pop()).toEqual(undefined)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(14).push(15).push(16).push(17)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([17, 16, 15, 14])
  })

  it('rearrange', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)

    stack.rearrange(() => false)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.rearrange(() => true)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(1).push(2).push(3)
    stack.rearrange(x => x % 2 === 1)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([3, 1])

    stack.push(4).push(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([5, 4, 3, 1])

    stack.rearrange(x => x % 2 === 0)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(1)
    expect(Array.from(stack)).toEqual([4])

    stack.rearrange(() => false)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(6)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(1)
    expect(Array.from(stack)).toEqual([6])

    stack.rearrange(() => true)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(1)
    expect(Array.from(stack)).toEqual([6])

    stack.push(7)
    stack.rearrange(x => x > 6)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(1)
    expect(Array.from(stack)).toEqual([7])

    stack.clear()
    stack.push(8).push(9).push(10).push(11).push(12)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([12, 11, 10, 9])

    stack.rearrange(x => x % 2 === 1)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([11, 9])

    stack.clear()
    stack.push(13).push(14).push(15).push(16).push(17).push(18)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([18, 17, 16, 15])

    stack.rearrange(x => x % 2 === 0)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([18, 16])

    stack.push(19).push(20).push(21).push(22).push(23).push(24).push(25)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([25, 24, 23, 22])

    stack.rearrange(x => x % 2 === 0)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([24, 22])

    stack.push(26).push(27).push(28).push(29).push(30).push(31).push(32).push(33)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([33, 32, 31, 30])

    stack.rearrange(x => x % 2 === 1)
    expect(stack.size).toEqual(2)
    expect(stack.capacity).toEqual(4)
    expect(Array.from(stack)).toEqual([33, 31])
  })

  it('resize', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(1).push(2).push(3).push(4)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([4, 3, 2, 1])

    stack.resize(3)
    expect(stack.capacity).toEqual(3)
    expect(stack.size).toEqual(3)
    expect(Array.from(stack)).toEqual([4, 3, 2])

    stack.push(5)
    expect(stack.capacity).toEqual(3)
    expect(stack.size).toEqual(3)
    expect(Array.from(stack)).toEqual([5, 4, 3])

    stack.resize(5)
    stack.push(6)
    expect(stack.capacity).toEqual(5)
    expect(stack.size).toEqual(4)
    expect(Array.from(stack)).toEqual([6, 5, 4, 3])

    stack.push(7)
    expect(stack.capacity).toEqual(5)
    expect(stack.size).toEqual(5)
    expect(Array.from(stack)).toEqual([7, 6, 5, 4, 3])

    stack.clear()
    expect(stack.capacity).toEqual(5)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    expect(() => stack.resize(0)).toThrow('capacity is expected to be a positive integer')
    expect(stack.capacity).toEqual(5)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(8).push(9).push(10).push(11).push(12).push(13).push(14)
    expect(stack.capacity).toEqual(5)
    expect(stack.size).toEqual(5)
    expect(Array.from(stack)).toEqual([14, 13, 12, 11, 10])

    stack.clear()
    expect(stack.capacity).toEqual(5)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.resize(2)
    expect(stack.capacity).toEqual(2)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])

    stack.push(15).push(16).push(17)
    expect(stack.capacity).toEqual(2)
    expect(stack.size).toEqual(2)
    expect(Array.from(stack)).toEqual([17, 16])
  })

  it('top', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])
    expect(stack.top()).toEqual(undefined)

    stack.push(1).push(2).push(3).push(4)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.top()).toEqual(4)
    expect(Array.from(stack)).toEqual([4, 3, 2, 1])

    stack.push(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.top()).toEqual(5)
    expect(Array.from(stack)).toEqual([5, 4, 3, 2])
  })

  it('update', () => {
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(0)
    expect(Array.from(stack)).toEqual([])
    expect(stack.at(0)).toEqual(undefined)

    stack.push(1).push(2).push(3).push(4)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.at(-1)).toEqual(undefined)
    expect(stack.at(0)).toEqual(1)
    expect(stack.at(1)).toEqual(2)
    expect(stack.at(2)).toEqual(3)
    expect(stack.at(3)).toEqual(4)
    expect(stack.at(4)).toEqual(undefined)
    expect(Array.from(stack)).toEqual([4, 3, 2, 1])

    stack.update(1, -2)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.at(-1)).toEqual(undefined)
    expect(stack.at(0)).toEqual(1)
    expect(stack.at(1)).toEqual(-2)
    expect(stack.at(2)).toEqual(3)
    expect(stack.at(3)).toEqual(4)
    expect(stack.at(4)).toEqual(undefined)
    expect(Array.from(stack)).toEqual([4, 3, -2, 1])

    stack.update(-1, -5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.at(-1)).toEqual(undefined)
    expect(stack.at(0)).toEqual(1)
    expect(stack.at(1)).toEqual(-2)
    expect(stack.at(2)).toEqual(3)
    expect(stack.at(3)).toEqual(4)
    expect(stack.at(4)).toEqual(undefined)
    expect(Array.from(stack)).toEqual([4, 3, -2, 1])

    stack.update(4, -5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.at(-1)).toEqual(undefined)
    expect(stack.at(0)).toEqual(1)
    expect(stack.at(1)).toEqual(-2)
    expect(stack.at(2)).toEqual(3)
    expect(stack.at(3)).toEqual(4)
    expect(stack.at(4)).toEqual(undefined)
    expect(Array.from(stack)).toEqual([4, 3, -2, 1])

    stack.push(5)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.at(-1)).toEqual(undefined)
    expect(stack.at(0)).toEqual(-2)
    expect(stack.at(1)).toEqual(3)
    expect(stack.at(2)).toEqual(4)
    expect(stack.at(3)).toEqual(5)
    expect(stack.at(4)).toEqual(undefined)
    expect(Array.from(stack)).toEqual([5, 4, 3, -2])

    stack.update(3, -9)
    expect(stack.capacity).toEqual(4)
    expect(stack.size).toEqual(4)
    expect(stack.at(-1)).toEqual(undefined)
    expect(stack.at(0)).toEqual(-2)
    expect(stack.at(1)).toEqual(3)
    expect(stack.at(2)).toEqual(4)
    expect(stack.at(3)).toEqual(-9)
    expect(stack.at(4)).toEqual(undefined)
    expect(Array.from(stack)).toEqual([-9, 4, 3, -2])
  })
})
