import { createHighDimensionArray, createScoreMap } from '../src'

describe('createScoreMap', () => {
  it('MAX_ADJACENT - 5', () => {
    expect(createScoreMap(5)).toMatchSnapshot()
  })
})

describe('createHighDimensionArray', () => {
  it('dimension - 1', () => {
    expect(createHighDimensionArray(() => -1, 20)).toEqual(new Array(20).fill(-1))
  })

  it('dimension - 2', () => {
    expect(createHighDimensionArray(() => -1, 20, 30)).toEqual(
      new Array(20).fill(-1).map(() => new Array(30).fill(-1)),
    )
  })

  it('dimension - 3', () => {
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
