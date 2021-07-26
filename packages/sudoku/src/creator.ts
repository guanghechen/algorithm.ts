import knuthShuffle, { randomInt } from '@algorithm.ts/knuth-shuffle'
import { SudokuSolver } from './solver'
import type { SudokuBoard, SudokuGameData } from './types'
import { copySudokuBoard, createSudokuBoard, fillSudokuBoard } from './util'

export interface SudokuCreatorOptions {
  /**
   * Size of the child puzzle matrix (sqrt of original puzzle size)
   */
  readonly childMatrixSize: number
  /**
   * The difficulty to solve the puzzle.
   * @default 0.2
   */
  difficulty?: number
}

export class SudokuCreator {
  public readonly SUDOKU_SIZE_SQRT: number
  public readonly SUDOKU_SIZE: number
  public readonly SUDOKU_SIZE_SQUARE: number
  protected readonly solver: SudokuSolver
  protected readonly gridCodes: number[]
  protected readonly segmentCodeMap: number[]
  protected readonly candidates: number[]
  protected readonly visitedNums: boolean[]
  protected readonly tmpBoard: SudokuBoard
  protected difficulty: number

  constructor(options: SudokuCreatorOptions) {
    const { childMatrixSize, difficulty = 0.2 } = options
    const SUDOKU_SIZE_SQRT = childMatrixSize
    const SUDOKU_SIZE = SUDOKU_SIZE_SQRT * SUDOKU_SIZE_SQRT
    const SUDOKU_SIZE_SQUARE = SUDOKU_SIZE * SUDOKU_SIZE
    const solver = new SudokuSolver({ childMatrixSize: SUDOKU_SIZE_SQRT })

    this.solver = solver
    this.SUDOKU_SIZE_SQRT = SUDOKU_SIZE_SQRT
    this.SUDOKU_SIZE = SUDOKU_SIZE
    this.SUDOKU_SIZE_SQUARE = SUDOKU_SIZE_SQUARE
    this.difficulty = this.resolveDifficulty(difficulty)

    const gridCodes: number[] = new Array(SUDOKU_SIZE_SQUARE)
    this.gridCodes = gridCodes
    for (let r = 0, i = 0; r < SUDOKU_SIZE; ++r) {
      const u = r << 16
      for (let c = 0; c < SUDOKU_SIZE; ++c, ++i) {
        gridCodes[i] = u | c
      }
    }

    const segmentCodeMap: number[] = new Array(SUDOKU_SIZE)
    this.segmentCodeMap = segmentCodeMap
    for (let i = 0, s = 0, j; i < SUDOKU_SIZE; i = j, ++s) {
      j = i + SUDOKU_SIZE_SQRT
      segmentCodeMap.fill(s, i, j)
    }

    this.candidates = new Array(SUDOKU_SIZE)
    this.visitedNums = new Array(SUDOKU_SIZE)
    this.tmpBoard = createSudokuBoard(SUDOKU_SIZE)
  }

  /**
   * Create a sudoku game data.
   * @param _difficulty
   * @returns
   */
  public createSudoku(_difficulty?: number): SudokuGameData {
    if (_difficulty != null) {
      this.difficulty = this.resolveDifficulty(_difficulty)
    }
    const solution: number[][] = this.createSolution()
    const puzzle: number[][] = this.createPuzzle(solution)
    return { puzzle, solution: solution }
  }

  /**
   * Create a full-filled sudoku data.
   * @returns
   */
  protected createSolution(): number[][] {
    const { SUDOKU_SIZE, SUDOKU_SIZE_SQUARE } = this
    const { candidates, gridCodes, solver, tmpBoard: radicalPuzzle } = this

    // Initial radical puzzle board.
    fillSudokuBoard(radicalPuzzle, -1)

    knuthShuffle(gridCodes)
    const _end = Math.floor((Math.random() * 0.3 + 0.2) * SUDOKU_SIZE_SQUARE)
    for (let i = 0; i < _end; ++i) {
      const p = gridCodes[i]
      const r = p >> 16
      const c = p & 0xffff

      // Get candidates
      const candidatesSize: number = this.calcCandidates(radicalPuzzle, r, c)
      if (candidatesSize < 1) continue

      const x = randomInt(candidatesSize)
      const v = candidates[x]
      radicalPuzzle[r][c] = v
    }

    const solution: number[][] = createSudokuBoard(SUDOKU_SIZE)
    for (let i = 0; i < _end; ++i) {
      if (solver.solve(radicalPuzzle, solution)) return solution

      const p = gridCodes[i]
      const r = p >> 16
      const c = p & 0xffff
      radicalPuzzle[r][c] = -1
    }
    throw new Error('[createSolution] This is impossible!')
  }

  /**
   * Create a sudoku puzzle that has only one unique solution.
   * @param solution
   * @returns
   */
  protected createPuzzle(solution: Readonly<SudokuBoard>): SudokuBoard {
    const { SUDOKU_SIZE, SUDOKU_SIZE_SQUARE } = this
    const { candidates, gridCodes, solver, difficulty } = this

    // First, fill the solution into the puzzle.
    const puzzle: number[][] = createSudokuBoard(SUDOKU_SIZE)
    copySudokuBoard(solution, puzzle)

    knuthShuffle(gridCodes)
    const _end = Math.floor(SUDOKU_SIZE_SQUARE * difficulty)
    for (let i = 0; i < _end; ++i) {
      const p = gridCodes[i]
      const r = p >> 16
      const c = p & 0xffff

      // Get candidates
      const candidatesSize: number = this.calcCandidates(puzzle, r, c)

      let j = 0
      if (candidatesSize > 0) {
        for (; j < candidatesSize; ++j) {
          puzzle[r][c] = candidates[j]
          if (solver.solve(puzzle, null)) break
        }
      }

      // If j < candidateSize, that means there are multiple solutions after
      // erase this grid, so we cannot erase it.
      puzzle[r][c] = j < candidatesSize ? solution[r][c] : -1
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
   * @param r
   * @param c
   */
  protected calcCandidates(
    board: Readonly<SudokuBoard>,
    r: number,
    c: number,
  ): number {
    const { SUDOKU_SIZE_SQRT, SUDOKU_SIZE } = this
    const { segmentCodeMap, candidates, visitedNums } = this
    visitedNums.fill(false)

    // Check rows
    for (let i = 0; i < SUDOKU_SIZE; ++i) {
      const v = board[r][i]
      if (v === -1) continue
      visitedNums[v] = true
    }

    // Check columns
    for (let i = 0; i < SUDOKU_SIZE; ++i) {
      const v = board[i][c]
      if (v === -1) continue
      visitedNums[v] = true
    }

    // Check sub-matrix
    const sr = segmentCodeMap[r] * SUDOKU_SIZE_SQRT
    const sc = segmentCodeMap[c] * SUDOKU_SIZE_SQRT
    for (let i = 0; i < SUDOKU_SIZE_SQRT; ++i) {
      const _r = sr + i
      for (let j = 0; j < SUDOKU_SIZE_SQRT; ++j) {
        const _c = sc + j
        const v = board[_r][_c]
        if (v === -1) continue
        visitedNums[v] = true
      }
    }

    // Collect candidates
    let tot = 0
    for (let v = 0; v < SUDOKU_SIZE; ++v) {
      if (visitedNums[v]) continue
      // eslint-disable-next-line no-plusplus
      candidates[tot++] = v
    }
    return tot
  }

  /**
   * Resolve the value of difficulty.
   * @param _difficulty
   * @returns
   */
  protected resolveDifficulty(_difficulty: number): number {
    const difficulty = Math.max(0, Math.min(1, _difficulty)) * 0.8 + 0.2
    return difficulty
  }
}
