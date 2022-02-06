import { testOjCodes } from 'jest.setup'
import { createSlidingWindow } from '../src'

describe('basic', function () {
  test('simple', function () {
    const elements: number[] = [1, 9, 3, 5, 4, 7, 6, 8, 2]
    const f = (idx: number): number => elements[idx]

    const slidingWindow = createSlidingWindow((idx: number, idy: number) => f(idx) - f(idy))
    slidingWindow.init(3)

    slidingWindow.moveForward()
    expect(f(slidingWindow.max())).toEqual(1)

    slidingWindow.moveForward(2)
    expect(f(slidingWindow.max())).toEqual(9)

    slidingWindow.moveForward()
    expect(f(slidingWindow.max())).toEqual(9)

    slidingWindow.moveForward()
    expect(f(slidingWindow.max())).toEqual(5)

    slidingWindow.moveForward()
    expect(f(slidingWindow.max())).toEqual(7)

    slidingWindow.moveForward()
    expect(f(slidingWindow.max())).toEqual(7)

    slidingWindow.moveForward()
    expect(f(slidingWindow.max())).toEqual(8)

    slidingWindow.moveForward()
    expect(f(slidingWindow.max())).toEqual(8)
  })
})

describe('oj', function () {
  // https://leetcode.com/problems/sliding-window-maximum/
  testOjCodes('leetcode/sliding-window-maximum', import('./oj/sliding-window-maximum'))
})
