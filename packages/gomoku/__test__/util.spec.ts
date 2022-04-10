import { createHighDimensionArray, createScoreMap } from '../src'

describe('createScoreMap', function () {
  test('MAX_ADJACENT - 5', function () {
    expect(createScoreMap(5)).toMatchSnapshot()
  })
})

describe('createHighDimensionArray', function () {
  test('dimension - 1', function () {
    expect(createHighDimensionArray(() => -1, 20)).toEqual(new Array(20).fill(-1))
  })

  test('dimension - 2', function () {
    expect(createHighDimensionArray(() => -1, 20, 30)).toEqual(
      new Array(20).fill(-1).map(() => new Array(30).fill(-1)),
    )
  })

  test('dimension - 3', function () {
    expect(createHighDimensionArray(() => -1, 20, 30, 10)).toEqual(
      new Array(20).fill(-1).map(() => new Array(30).fill(-1).map(() => new Array(10).fill(-1))),
    )
    expect(createHighDimensionArray(() => -1, 3, 4, 2)).toEqual([
      [
        [-1, -1],
        [-1, -1],
        [-1, -1],
        [-1, -1],
      ],
      [
        [-1, -1],
        [-1, -1],
        [-1, -1],
        [-1, -1],
      ],
      [
        [-1, -1],
        [-1, -1],
        [-1, -1],
        [-1, -1],
      ],
    ])
  })
})
