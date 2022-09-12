import { knuthShuffle, randomInt } from '@algorithm.ts/shuffle'
import { SudokuSize } from './size'
import { SudokuSolver } from './solver'
import type { ISudokuBoardData, ISudokuData, ISudokuSize } from './types'
import {
  copySudokuBoardData,
  createMatrixCoordinateMap,
  createSudokuBoardData,
  fillSudokuBoardData,
} from './util'

export interface ISudokuCreatorOptions {
  /**
   * Size of the child puzzle matrix (sqrt of original puzzle size)
   */
  readonly childMatrixWidth: number
  /**
   * The difficulty to solve the puzzle.
   * @default 0.2
   */
  difficulty?: number
}

export class SudokuCreator {
  public readonly size: Readonly<ISudokuSize>
  protected readonly solver: SudokuSolver
  protected readonly matCoordinateMap: ReadonlyArray<number>
  protected readonly gridCodes: number[]
  protected readonly candidates: number[]
  protected readonly availableNums: boolean[]
  protected readonly tmpBoard: ISudokuBoardData
  protected difficulty: number

  constructor(options: ISudokuCreatorOptions) {
    const { childMatrixWidth, difficulty = 0.2 } = options
    const size = new SudokuSize(childMatrixWidth)
    const solver = new SudokuSolver({ childMatrixWidth })
    const gridCodes: number[] = new Array(size.BOARD)
    for (let i = 0; i < size.BOARD; ++i) gridCodes[i] = i

    this.size = size
    this.solver = solver
    this.matCoordinateMap = createMatrixCoordinateMap(size)
    this.gridCodes = gridCodes
    this.difficulty = this._resolveDifficulty(difficulty)

    this.candidates = new Array(size.MATRIX)
    this.availableNums = new Array(size.MATRIX)
    this.tmpBoard = createSudokuBoardData(size)
  }

  /**
   * Create a sudoku game data.
   * @param difficulty
   * @returns
   */
  public createSudoku(difficulty?: number): ISudokuData {
    if (difficulty != null) this.difficulty = this._resolveDifficulty(difficulty)
    const solution: ISudokuBoardData = this._createSolution()
    const puzzle: ISudokuBoardData = this._createPuzzle(solution)
    return { puzzle, solution: solution }
  }

  /**
   * Create a full-filled sudoku data.
   * @returns
   */
  protected _createSolution(): ISudokuBoardData {
    const { size, candidates, gridCodes, solver, tmpBoard: radicalPuzzle } = this

    // Initial radical puzzle board.
    fillSudokuBoardData(radicalPuzzle, -1, size)

    // Add randomness.
    knuthShuffle(gridCodes)

    const filledCount = Math.round((Math.random() * 0.3 + 0.2) * size.BOARD)
    const _end = Math.max(size.BASE_3, Math.min(size.BOARD, filledCount))
    for (let i = 0; i < _end; ++i) {
      const p = gridCodes[i]

      // Get candidates
      const candidatesSize: number = this._collectCandidates(radicalPuzzle, p)

      /* istanbul ignore next */
      if (candidatesSize < 1) continue

      const x = randomInt(candidatesSize)
      const v = candidates[x]
      radicalPuzzle[p] = v
    }

    const solution: ISudokuBoardData = createSudokuBoardData(size)
    for (let i = 0; i < _end; ++i) {
      const p = gridCodes[i]

      /* istanbul ignore next */
      if (p === -1) continue

      if (solver.solve(radicalPuzzle, solution)) return solution
      radicalPuzzle[p] = -1
    }

    /* istanbul ignore next */
    throw new Error('[createSolution] This is impossible!')
  }

  /**
   * Create a sudoku puzzle that has only one unique solution.
   * @param solution
   * @returns
   */
  protected _createPuzzle(solution: Readonly<ISudokuBoardData>): ISudokuBoardData {
    const { size, candidates, gridCodes, solver, difficulty } = this

    // First, fill the solution into the puzzle.
    const puzzle: ISudokuBoardData = createSudokuBoardData(size)
    copySudokuBoardData(solution, puzzle, size)

    // Add randomness.
    knuthShuffle(gridCodes)

    const _end = Math.floor(size.BOARD * difficulty)
    for (let i = 0; i < _end; ++i) {
      const p = gridCodes[i]

      // Get candidates
      const candidatesSize: number = this._collectCandidates(puzzle, p)

      let j = 0
      for (; j < candidatesSize; ++j) {
        puzzle[p] = candidates[j]
        if (solver.solve(puzzle, null)) break
      }

      // If j < candidateSize, that means there are multiple solutions after
      // erase this grid, so we cannot erase it.
      puzzle[p] = j < candidatesSize ? solution[p] : -1
    }
    return puzzle
  }

  /**
   * Calculate which numbers can be filled in a specified grid (r,c) in the
   * Sudoku board.
   *
   * For the sake of saving memory space, the number candidates are stored in
   * this.candidates, and the function only returns the number of candidates.
   *
   * @param board
   * @param p
   */
  protected _collectCandidates(board: Readonly<ISudokuBoardData>, p: number): number {
    const { size, matCoordinateMap, candidates, availableNums } = this
    const { MATRIX_RANK, MATRIX, BOARD } = size

    const c0: number = p % MATRIX
    const r0: number = p - c0
    const p0: number = matCoordinateMap[p]

    availableNums.fill(true)

    // Check rows
    for (let i = r0, I = r0 + MATRIX; i < I; ++i) {
      const v = board[i]
      if (v !== -1) availableNums[v] = false
    }

    // Check columns
    for (let i = c0; i < BOARD; i += MATRIX) {
      const v = board[i]
      if (v !== -1) availableNums[v] = false
    }

    // Check sub-matrix
    for (let i0 = p0, ri = 0; ri < MATRIX_RANK; ++ri, i0 += MATRIX) {
      for (let i = i0, I = i0 + MATRIX_RANK; i < I; ++i) {
        const v = board[i]
        if (v !== -1) availableNums[v] = false
      }
    }

    // Collect candidates
    let tot = 0
    for (let v = 0; v < MATRIX; ++v) {
      if (availableNums[v]) candidates[tot++] = v
    }
    return tot
  }

  /**
   * Resolve the value of difficulty.
   * @param _difficulty
   * @returns
   */
  protected _resolveDifficulty(_difficulty: number): number {
    const difficulty = Math.max(0, Math.min(1, _difficulty)) * 0.8 + 0.2
    return difficulty
  }
}
