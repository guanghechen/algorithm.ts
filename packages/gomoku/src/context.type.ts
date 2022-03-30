import type { GomokuDirectionType } from './constant'
import type { IGomokuBoard, IGomokuPiece, INeighbor } from './types'

export interface IGomokuContext {
  /**
   * Number of rows.
   */
  readonly MAX_ROW: number

  /**
   * Number of columns.
   */
  readonly MAX_COL: number

  /**
   * The maximum number of pieces with the same color allowed to be adjacent in the same direction.
   */
  readonly MAX_ADJACENT: number

  /**
   * The distance to the farthest neighbor to the current position.
   */
  readonly MAX_DISTANCE_OF_NEIGHBOR: number

  /**
   * The total number of valid positions on the board.
   */
  readonly TOTAL_POS: number

  /**
   * Gomoku board.
   */
  readonly board: Readonly<IGomokuBoard>

  /**
   * The total number of positions that haven been placed.
   */
  readonly placedCount: number

  /**
   * The coordinate id of the position in the middle of the chessboard.
   */
  readonly MIDDLE_POS: number

  /**
   * Initialize context with given pieces.
   * @param pieces
   */
  init(pieces: ReadonlyArray<IGomokuPiece>): void

  /**
   * Place a piece on the given position.
   * @param posId
   * @param playerId
   */
  forward(posId: number, playerId: number): boolean

  /**
   * Remove the piece from the given position.
   * @param posId
   */
  revert(posId: number): boolean

  /**
   * Get position id.
   * @param r Row number of the target position.
   * @param c Column number of the target position.
   */
  idx(r: number, c: number): number

  /**
   * Get the coordinates (r, c) of the target position.
   * @param posId
   */
  revIdx(posId: number): Readonly<[r: number, c: number]>

  /**
   * Check if a given position is a legal position
   * @param r
   * @param c
   */
  isValidPos(r: number, c: number): boolean

  /**
   * Move the specified number of steps in the given direction.
   *
   * If the position after the move is out of bounds, return -1.
   *
   * @param posId     Started position. !!!Should be a valid pos id in bounds.
   * @param dirType   Moving direction.
   * @param step      Number of steps to move. !!! Should be a non-negative integer.
   */
  safeMove(posId: number, dirType: GomokuDirectionType, step: number): number | -1

  /**
   * Move exactly one step in the given direction.
   *
   * If the position after the move is out of bounds, return -1.
   *
   * @param posId     Started position. !!!Should be a valid pos id in bounds.
   * @param dirType   Moving direction.
   */
  safeMoveOneStep(posId: number, dirType: GomokuDirectionType): number | -1

  /**
   * Move the specified number of steps in the given direction.
   *
   * !!! The position after the move should be not out of bounds.
   *
   * @param posId     Started position. !!!Should be a valid pos id in bounds.
   * @param dirType   Moving direction.
   * @param step      Number of steps to move. !!! Should be a non-negative integer.
   */
  fastMove(posId: number, dirType: GomokuDirectionType, step: number): number

  /**
   * Move exactly one step in the given direction.
   *
   * !!! The position after the move should be not out of bounds.
   *
   * @param posId     Started position. !!!Should be a valid pos id in bounds.
   * @param dirType   Moving direction.
   */
  fastMoveOneStep(posId: number, dirType: GomokuDirectionType): number | -1

  /**
   * The maximum number of steps in the given direction can be moved.
   * @param posId
   * @param dirType
   */
  maxMovableSteps(posId: number, dirType: GomokuDirectionType): number

  /**
   * All accessible neighbor positions.
   */
  accessibleNeighbors(posId: number): Iterable<INeighbor>

  /**
   *
   * @param posId
   */
  hasPlacedNeighbors(posId: number): boolean

  /**
   * Get the id of first position in the given direction.
   * @param posId
   * @param dirType
   */
  getStartPosId(posId: number, dirType: GomokuDirectionType): number

  /**
   *
   * @param dirType
   */
  getStartPosSet(dirType: GomokuDirectionType): Iterable<number>

  /**
   *
   * @param handle
   */
  traverseAllDirections(handle: (dirType: GomokuDirectionType) => (posId: number) => void): void
}
