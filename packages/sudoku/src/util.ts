import type { ISudokuBoardData, ISudokuSize } from './types'

export const createSudokuBoardData = (size: Readonly<ISudokuSize>): ISudokuBoardData =>
  new Array(size.BOARD)
export const fillSudokuBoardData = (
  board: ISudokuBoardData,
  value: number,
  size: Readonly<ISudokuSize>,
): void => {
  board.fill(value, 0, size.BOARD)
}
export const copySudokuBoardData = (
  srcBoard: Readonly<ISudokuBoardData>,
  dstBoard: ISudokuBoardData,
  size: Readonly<ISudokuSize>,
): void => {
  const { BOARD } = size
  // eslint-disable-next-line no-param-reassign
  for (let i = 0; i < BOARD; ++i) dstBoard[i] = srcBoard[i]
}
export const toMatrixStyleBoardData = (
  board: Readonly<ISudokuBoardData>,
  size: Readonly<ISudokuSize>,
): number[][] => {
  const results: number[][] = []
  const { MATRIX } = size
  for (let r = 0, id = 0; r < MATRIX; ++r) {
    const row: number[] = []
    results[r] = row
    for (let c = 0; c < MATRIX; ++c, ++id) row[c] = board[id]
  }
  return results
}

/**
 * In returned data (let's call it matCodeMap), matCodeMap[p]=x represent that the p-th element of
 * the sudoku board is belongs the x-th child-matrix of the sudoku board.
 * @param size
 * @returns
 */
export function createMatrixCodeMap(size: Readonly<ISudokuSize>): number[] {
  const { BASE_1, BASE_3, MATRIX, BOARD } = size
  const matCodeMap = new Array(BOARD)
  for (let r0 = 0, code0 = 0; r0 < BOARD; r0 += BASE_3, code0 += BASE_1) {
    for (let r = r0, R = r0 + BASE_3; r < R; r += MATRIX) {
      for (let i = r, I = r + MATRIX, code = code0; i < I; i += BASE_1) {
        matCodeMap.fill(code++, i, i + BASE_1)
      }
    }
  }
  return matCodeMap
}

/**
 * In returned data (let's call it matCoordinateMap), matCoordinateMap[p]=x represent that the p-th
 * element of the sudoku board is belongs the child-matrix which the left-top element index is x.
 * @param size
 * @returns
 */
export function createMatrixCoordinateMap(size: Readonly<ISudokuSize>): number[] {
  const { BASE_1, BASE_3, MATRIX, BOARD } = size
  const matCoordinateMap = new Array(BOARD)
  for (let r0 = 0, idx = 0; r0 < BOARD; r0 += BASE_3) {
    for (let r = r0, R = r0 + BASE_3; r < R; r += MATRIX) {
      for (let c0 = 0; c0 < MATRIX; c0 += BASE_1) {
        const nextIdx = idx + BASE_1
        matCoordinateMap.fill(r0 + c0, idx, nextIdx)
        idx = nextIdx
      }
    }
  }
  return matCoordinateMap
}

export function verifySolution(
  solution: Readonly<ISudokuBoardData>,
  size: Readonly<ISudokuSize>,
): boolean {
  const { BASE_1, BASE_3, MATRIX, BOARD } = size
  for (let i = 0; i < BOARD; ++i) {
    if (solution[i] === -1) return false
  }

  const visited: number[] = new Array(MATRIX).fill(0)
  let visitedFlag = 1

  // Check rows.
  for (let r0 = 0; r0 < BOARD; r0 += MATRIX, ++visitedFlag) {
    for (let i = r0, I = r0 + MATRIX; i < I; ++i) {
      const w = solution[i]
      if (visited[w] === visitedFlag) return false
      visited[w] = visitedFlag
    }
  }

  // Check columns.
  for (let c0 = 0; c0 < MATRIX; ++c0, ++visitedFlag) {
    for (let i = c0; i < BOARD; i += MATRIX) {
      const w = solution[i]
      if (visited[w] === visitedFlag) return false
      visited[w] = visitedFlag
    }
  }

  // Check sub-child matrix.
  for (let r0 = 0; r0 < BOARD; r0 += BASE_3) {
    for (let c0 = 0; c0 < MATRIX; c0 += BASE_1, ++visitedFlag) {
      for (let r = r0, R = r0 + BASE_3; r < R; r += MATRIX) {
        for (let i = r + c0, I = i + BASE_1; i < I; ++i) {
          const w = solution[i]
          if (visited[w] === visitedFlag) return false
          visited[w] = visitedFlag
        }
      }
    }
  }

  return true
}
