import type { ISudokuBoardData } from '../src'
import {
  SudokuSize,
  createMatrixCodeMap,
  createMatrixCoordinateMap,
  toMatrixStyleBoardData,
  verifySolution,
} from '../src'

describe('toMatrixStyleBoardData', () => {
  test('3x3', function () {
    const size = new SudokuSize(3)
    // prettier-ignore
    const board: ISudokuBoardData = [
    0,  1,  2,  3,  4,  5,  6,  7,  8,
    9,  10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44,
    45, 46, 47, 48, 49, 50, 51, 52, 53,
    54, 55, 56, 57, 58, 59, 60, 61, 62,
    63, 64, 65, 66, 67, 68, 69, 70, 71,
    72, 73, 74, 75, 76, 77, 78, 79, 80,
  ]

    // prettier-ignore
    expect(toMatrixStyleBoardData(board, size)).toEqual([
      [0,   1,  2,  3,  4,  5,  6,  7,  8],
      [9,  10, 11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31, 32, 33, 34, 35],
      [36, 37, 38, 39, 40, 41, 42, 43, 44],
      [45, 46, 47, 48, 49, 50, 51, 52, 53],
      [54, 55, 56, 57, 58, 59, 60, 61, 62],
      [63, 64, 65, 66, 67, 68, 69, 70, 71],
      [72, 73, 74, 75, 76, 77, 78, 79, 80],
    ])
  })
})

describe('createMatrixCodeMap', () => {
  test('3x3', function () {
    const size = new SudokuSize(3)
    const matCodeMap = createMatrixCodeMap(size)

    // prettier-ignore
    expect(matCodeMap).toEqual([
      0, 0, 0, 1, 1, 1, 2, 2, 2,
      0, 0, 0, 1, 1, 1, 2, 2, 2,
      0, 0, 0, 1, 1, 1, 2, 2, 2,
      3, 3, 3, 4, 4, 4, 5, 5, 5,
      3, 3, 3, 4, 4, 4, 5, 5, 5,
      3, 3, 3, 4, 4, 4, 5, 5, 5,
      6, 6, 6, 7, 7, 7, 8, 8, 8,
      6, 6, 6, 7, 7, 7, 8, 8, 8,
      6, 6, 6, 7, 7, 7, 8, 8, 8,
    ])
  })

  test('4x4', function () {
    const size = new SudokuSize(4)
    const matCodeMap = createMatrixCodeMap(size)

    // prettier-ignore
    expect(matCodeMap).toEqual([
      0,  0,  0,  0,  1,  1,  1,  1,  2,  2,  2,  2,  3,  3,  3,  3,
      0,  0,  0,  0,  1,  1,  1,  1,  2,  2,  2,  2,  3,  3,  3,  3,
      0,  0,  0,  0,  1,  1,  1,  1,  2,  2,  2,  2,  3,  3,  3,  3,
      0,  0,  0,  0,  1,  1,  1,  1,  2,  2,  2,  2,  3,  3,  3,  3,
      4,  4,  4,  4,  5,  5,  5,  5,  6,  6,  6,  6,  7,  7,  7,  7,
      4,  4,  4,  4,  5,  5,  5,  5,  6,  6,  6,  6,  7,  7,  7,  7,
      4,  4,  4,  4,  5,  5,  5,  5,  6,  6,  6,  6,  7,  7,  7,  7,
      4,  4,  4,  4,  5,  5,  5,  5,  6,  6,  6,  6,  7,  7,  7,  7,
      8,  8,  8,  8,  9,  9,  9,  9,  10, 10, 10, 10, 11, 11, 11, 11,
      8,  8,  8,  8,  9,  9,  9,  9,  10, 10, 10, 10, 11, 11, 11, 11,
      8,  8,  8,  8,  9,  9,  9,  9,  10, 10, 10, 10, 11, 11, 11, 11,
      8,  8,  8,  8,  9,  9,  9,  9,  10, 10, 10, 10, 11, 11, 11, 11,
      12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
      12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
      12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
      12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15,
    ])
  })
})

describe('createMatrixCoordinateMap', () => {
  test('3x3', function () {
    const size = new SudokuSize(3)
    const matCoordinateMap = createMatrixCoordinateMap(size)

    // prettier-ignore
    expect(matCoordinateMap).toEqual([
      0,  0,  0,  3,  3,  3,  6,  6,  6,
      0,  0,  0,  3,  3,  3,  6,  6,  6,
      0,  0,  0,  3,  3,  3,  6,  6,  6,
      27, 27, 27, 30, 30, 30, 33, 33, 33,
      27, 27, 27, 30, 30, 30, 33, 33, 33,
      27, 27, 27, 30, 30, 30, 33, 33, 33,
      54, 54, 54, 57, 57, 57, 60, 60, 60,
      54, 54, 54, 57, 57, 57, 60, 60, 60,
      54, 54, 54, 57, 57, 57, 60, 60, 60,
    ])
  })

  test('4x4', function () {
    const size = new SudokuSize(4)
    const matCoordinateMap = createMatrixCoordinateMap(size)

    // prettier-ignore
    expect(matCoordinateMap).toEqual([
      0,   0,   0,   0,   4,   4,   4,   4,   8,   8,   8,   8,   12,  12,  12,  12,
      0,   0,   0,   0,   4,   4,   4,   4,   8,   8,   8,   8,   12,  12,  12,  12,
      0,   0,   0,   0,   4,   4,   4,   4,   8,   8,   8,   8,   12,  12,  12,  12,
      0,   0,   0,   0,   4,   4,   4,   4,   8,   8,   8,   8,   12,  12,  12,  12,
      64,  64,  64,  64,  68,  68,  68,  68,  72,  72,  72,  72,  76,  76,  76,  76,
      64,  64,  64,  64,  68,  68,  68,  68,  72,  72,  72,  72,  76,  76,  76,  76,
      64,  64,  64,  64,  68,  68,  68,  68,  72,  72,  72,  72,  76,  76,  76,  76,
      64,  64,  64,  64,  68,  68,  68,  68,  72,  72,  72,  72,  76,  76,  76,  76,
      128, 128, 128, 128, 132, 132, 132, 132, 136, 136, 136, 136, 140, 140, 140, 140,
      128, 128, 128, 128, 132, 132, 132, 132, 136, 136, 136, 136, 140, 140, 140, 140,
      128, 128, 128, 128, 132, 132, 132, 132, 136, 136, 136, 136, 140, 140, 140, 140,
      128, 128, 128, 128, 132, 132, 132, 132, 136, 136, 136, 136, 140, 140, 140, 140,
      192, 192, 192, 192, 196, 196, 196, 196, 200, 200, 200, 200, 204, 204, 204, 204,
      192, 192, 192, 192, 196, 196, 196, 196, 200, 200, 200, 200, 204, 204, 204, 204,
      192, 192, 192, 192, 196, 196, 196, 196, 200, 200, 200, 200, 204, 204, 204, 204,
      192, 192, 192, 192, 196, 196, 196, 196, 200, 200, 200, 200, 204, 204, 204, 204,
    ])
  })
})

describe('verifySolution', () => {
  test('3x3', function () {
    const size = new SudokuSize(3)
    // prettier-ignore
    const solution = [
      4, 0, 6, 2, 3, 8, 1, 5, 7,
      5, 2, 3, 6, 7, 1, 8, 0, 4,
      8, 1, 7, 0, 4, 5, 6, 3, 2,
      2, 6, 8, 1, 0, 7, 3, 4, 5,
      7, 3, 4, 5, 8, 2, 0, 1, 6,
      0, 5, 1, 3, 6, 4, 7, 2, 8,
      1, 7, 2, 8, 5, 0, 4, 6, 3,
      6, 8, 5, 4, 1, 3, 2, 7, 0,
      3, 4, 0, 7, 2, 6, 5, 8, 1,
    ]

    expect(verifySolution(solution, size)).toEqual(true)
    for (let i = 0; i < size.BOARD; ++i) {
      const vv = solution[i]
      for (let v = -1; v < size.MATRIX; ++v) {
        if (v === vv) continue
        solution[i] = v
        expect(verifySolution(solution, size)).toEqual(false)
      }
      solution[i] = vv
    }
    expect(verifySolution(solution, size)).toEqual(true)
  })

  test('3x3 -- not a solution (row)', function () {
    const size = new SudokuSize(3)

    // prettier-ignore
    const solution = [
      4, 0, 6, 2, 3, 8, 1, 5, 7,
      5, 2, 3, 6, 7, 1, 8, 0, 4,
      8, 1, 7, 0, 4, 5, 6, 3, 2,
      2, 6, 8, 1, 0, 7, 3, 4, 5,
      7, 3, 4, 5, 8, 2, 0, 1, 6,
      0, 5, 1, 3, 6, 4, 7, 2, 8,
      1, 7, 2, 8, 5, 0, 4, 6, 3,
      3, 8, 5, 4, 1, 3, 2, 7, 0,
      6, 4, 0, 7, 2, 6, 5, 8, 1,
    ]
    expect(verifySolution(solution, size)).toEqual(false)
  })

  test('3x3 -- not a solution (column)', function () {
    const size = new SudokuSize(3)

    // prettier-ignore
    const solution = [
      4, 0, 6, 2, 3, 8, 1, 5, 7,
      5, 2, 3, 6, 7, 1, 8, 0, 4,
      8, 1, 7, 0, 4, 5, 6, 3, 2,
      2, 6, 8, 1, 0, 7, 3, 4, 5,
      7, 3, 4, 5, 8, 2, 0, 1, 6,
      0, 5, 1, 3, 6, 4, 7, 2, 8,
      1, 7, 2, 5, 8, 0, 4, 6, 3,
      6, 8, 5, 4, 1, 3, 2, 7, 0,
      3, 4, 0, 7, 2, 6, 5, 8, 1,
    ]
    expect(verifySolution(solution, size)).toEqual(false)
  })

  test('3x3 -- not a solution (matrix)', function () {
    const size = new SudokuSize(3)

    // prettier-ignore
    const solution = [
      0, 1, 2, 3, 4, 5, 6, 7, 8,
      1, 2, 3, 4, 5, 6, 7, 8, 0,
      2, 3, 4, 5, 6, 7, 8, 0, 1,
      3, 4, 5, 6, 7, 8, 0, 1, 2,
      4, 5, 6, 7, 8, 0, 1, 2, 3,
      5, 6, 7, 8, 0, 1, 2, 3, 4,
      6, 7, 8, 0, 1, 2, 3, 4, 5,
      7, 8, 0, 1, 2, 3, 4, 5, 6,
      8, 0, 1, 2, 3, 4, 5, 6, 7,
    ]
    expect(verifySolution(solution, size)).toEqual(false)
  })
})
