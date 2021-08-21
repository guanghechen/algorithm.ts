import { createCircularQueue } from '../src'

describe('createCircularQueue', function () {
  const _size = 100

  test('basic', function () {
    const queue = createCircularQueue()
    queue.init(_size)
    for (let i = 0; i < _size; ++i) {
      const x = queue.enqueue(i)
      expect(queue.get(x)).toBe(i)
      expect(queue.size()).toBe(i + 1)
      expect(queue.end()).toBe(x)
    }

    let cnt = 0
    for (let i = 0; !queue.isEmpty(); ++i, ++cnt) {
      expect(queue.front()).toBe(i)

      const x = queue.dequeue()
      expect(x).toBe(i)
    }

    expect(cnt).toBe(_size)
    expect(queue.front()).toBe(undefined)
    expect(queue.end()).toBe(undefined)
    expect(queue.isEmpty()).toBe(true)
    expect(queue.size()).toBe(0)

    expect(queue.dequeue()).toBe(undefined)
    expect(queue.size()).toBe(0)
  })

  test('excess', function () {
    const queue = createCircularQueue()
    queue.init(_size)
    for (let i = 0; i < _size; ++i) {
      expect(queue.size()).toBe(i)
      expect(queue.enqueue(i)).toBe(i)
    }

    expect(queue.size()).toBe(_size)
    for (let i = 0; i < _size; ++i) {
      expect(queue.enqueue(100 + i)).toBe(i)
      expect(queue.size()).toBe(_size)
    }

    expect(queue.size()).toBe(_size)
    for (let i = 0; i < _size; ++i) {
      expect(queue.enqueue(200 + i)).toBe(i)
      expect(queue.size()).toBe(_size)
    }

    for (let i = 0; i < _size; ++i) expect(queue.get(i)).toBe(200 + i)
  })

  test('invalid', function () {
    const queue = createCircularQueue()
    queue.init(_size)

    expect(queue.isValidIndex(-1)).toBe(false)
    expect(queue.isValidIndex(0)).toBe(false)
    expect(queue.isValidIndex(1)).toBe(false)
    expect(queue.isValidIndex(-1)).toBe(false)
    expect(queue.isValidIndex(_size)).toBe(false)
    expect(queue.isValidIndex(_size + 1)).toBe(false)

    queue.enqueue(1)
    queue.enqueue(2)
    expect(queue.isValidIndex(-1)).toBe(false)
    expect(queue.isValidIndex(0)).toBe(true)
    expect(queue.isValidIndex(1)).toBe(true)
    expect(queue.isValidIndex(2)).toBe(false)
    expect(queue.isValidIndex(3)).toBe(false)
    expect(queue.isValidIndex(-1)).toBe(false)
    expect(queue.isValidIndex(_size)).toBe(false)
    expect(queue.isValidIndex(_size + 1)).toBe(false)

    queue.dequeue()
    expect(queue.isValidIndex(-1)).toBe(false)
    expect(queue.isValidIndex(0)).toBe(false)
    expect(queue.isValidIndex(1)).toBe(true)
    expect(queue.isValidIndex(2)).toBe(false)
    expect(queue.isValidIndex(3)).toBe(false)
    expect(queue.isValidIndex(-1)).toBe(false)
    expect(queue.isValidIndex(_size)).toBe(false)
    expect(queue.isValidIndex(_size + 1)).toBe(false)

    queue.enqueue(9)
    expect(queue.isValidIndex(-1)).toBe(false)
    expect(queue.isValidIndex(0)).toBe(false)
    expect(queue.isValidIndex(1)).toBe(true)
    expect(queue.isValidIndex(2)).toBe(true)
    expect(queue.isValidIndex(3)).toBe(false)
    expect(queue.isValidIndex(-1)).toBe(false)
    expect(queue.isValidIndex(_size)).toBe(false)
    expect(queue.isValidIndex(_size + 1)).toBe(false)

    expect(queue.get(1)).toBe(2)
    expect(queue.get(2)).toBe(9)

    expect(queue.set(0, 10)).toBe(false)
    expect(queue.set(1, 10)).toBe(true)

    expect(queue.get(0)).toBe(undefined)
    expect(queue.get(0, true)).toBe(undefined)
    expect(queue.get(0, false)).toBe(1)

    expect(queue.get(1)).toBe(10)
    expect(queue.get(2)).toBe(9)
    expect(queue.get(3)).toBe(undefined)
  })

  test('init', function () {
    const queue = createCircularQueue()
    queue.init(2)
    expect(queue.size()).toBe(0)

    queue.enqueue(1)
    queue.enqueue(2)
    expect(queue.get(0)).toBe(1)
    expect(queue.get(1)).toBe(2)

    queue.enqueue(4)
    expect(queue.get(0)).toBe(4)
    expect(queue.get(1)).toBe(2)
    expect(queue.size()).toBe(2)
    expect(queue.size()).toBe(2)

    queue.init(3)
    expect(queue.size()).toBe(0)

    queue.enqueue(1)
    queue.enqueue(2)
    expect(queue.get(0)).toBe(1)
    expect(queue.get(1)).toBe(2)
    expect(queue.get(2)).toBe(undefined)

    queue.enqueue(4)
    expect(queue.get(0)).toBe(1)
    expect(queue.get(1)).toBe(2)
    expect(queue.get(2)).toBe(4)
    expect(queue.size()).toBe(3)

    queue.init(2)
    expect(queue.size()).toBe(0)

    queue.enqueue(1)
    queue.enqueue(2)
    expect(queue.get(0)).toBe(1)
    expect(queue.get(1)).toBe(2)

    queue.enqueue(4)
    expect(queue.get(0)).toBe(4)
    expect(queue.get(1)).toBe(2)
    expect(queue.size()).toBe(2)
    expect(queue.size()).toBe(2)
  })
})
