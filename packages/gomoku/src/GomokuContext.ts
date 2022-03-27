import type { GomokuDirectionType } from './constant'
import {
  gomokuDirectionTypes,
  gomokuDirections,
  leftHalfGomokuDirectionTypes,
  rightHalfGomokuDirectionTypes,
} from './constant'
import type { IGomokuBoard, IGomokuPiece } from './types'

export class GomokuContext {
  public readonly MAX_ROW: number
  public readonly MAX_COL: number
  public readonly MAX_INLINE: number
  public readonly MAX_NEXT_MOVER_BUFFER: number
  public readonly TOTAL_POS: number
  public readonly board: Readonly<IGomokuBoard>
  protected readonly _gomokuDirections: Readonly<Int32Array>
  protected readonly _idxMap: ReadonlyArray<Readonly<[r: number, c: number]>>
  protected readonly _idxMaxMoveMap: ReadonlyArray<Readonly<Int32Array>>
  protected _placedCount: number
  protected _nextMoverBuffer: number

  constructor(MAX_ROW: number, MAX_COL: number, MAX_INLINE: number, MAX_NEXT_MOVER_BUFFER = 0.4) {
    const _TOTAL_POS: number = MAX_ROW * MAX_COL
    const _MAX_NEXT_MOVER_BUFFER = Math.max(0, Math.min(1, MAX_NEXT_MOVER_BUFFER))
    const _gomokuDirections = new Int32Array(gomokuDirections.map(([dr, dc]) => dr * MAX_ROW + dc))
    const board: IGomokuBoard = new Int32Array(_TOTAL_POS)

    const _idxMap: Array<Readonly<[r: number, c: number]>> = new Array(_TOTAL_POS)
    for (let r = 0; r < MAX_ROW; ++r) {
      for (let c = 0; c < MAX_COL; ++c) {
        const id: number = r * MAX_ROW + c
        _idxMap[id] = [r, c]
      }
    }

    const _idxMaxMoveMap: Array<Readonly<Int32Array>> = new Array(gomokuDirectionTypes.length)
    for (const dirType of gomokuDirectionTypes) {
      const maxMoveMap = new Int32Array(_TOTAL_POS)
      const [dr, dc] = gomokuDirections[dirType]
      for (let r = 0; r < MAX_ROW; ++r) {
        for (let c = 0; c < MAX_COL; ++c) {
          let steps = 0
          for (let r2 = r, c2 = c; ; ++steps) {
            r2 += dr
            c2 += dc
            if (r2 < 0 || r2 >= MAX_ROW || c2 < 0 || c2 >= MAX_COL) break
          }
          const id: number = r * MAX_ROW + c
          maxMoveMap[id] = steps
        }
      }
      _idxMaxMoveMap[dirType] = maxMoveMap
    }

    this.MAX_ROW = MAX_ROW
    this.MAX_COL = MAX_COL
    this.MAX_INLINE = MAX_INLINE
    this.TOTAL_POS = _TOTAL_POS
    this.MAX_NEXT_MOVER_BUFFER = _MAX_NEXT_MOVER_BUFFER
    this.board = board
    this._gomokuDirections = _gomokuDirections
    this._idxMap = _idxMap
    this._idxMaxMoveMap = _idxMaxMoveMap
    this._placedCount = 0
    this._nextMoverBuffer = 0
  }

  public get placedCount(): number {
    return this._placedCount
  }

  public get nextMoverBuffer(): number {
    return this._nextMoverBuffer
  }

  public reRandNextMoverBuffer(): void {
    this._nextMoverBuffer = Math.random() * this.MAX_NEXT_MOVER_BUFFER
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    const board = this.board as IGomokuBoard
    board.fill(-1)
    this._placedCount = pieces.length
    for (const { r, c, p } of pieces) {
      const id: number = this.idx(r, c)
      board[id] = p
    }
  }

  public forward(id: number, p: number): void {
    const board = this.board as IGomokuBoard
    board[id] = p
    this._placedCount += 1
  }

  public rollback(id: number): void {
    const board = this.board as IGomokuBoard
    board[id] = -1
    this._placedCount -= 1
  }

  public idx(r: number, c: number): number {
    return r * this.MAX_ROW + c
  }

  public idxIfValid(r: number, c: number): number {
    return this.isValidPos(r, c) ? r * this.MAX_ROW + c : -1
  }

  /**
   * Parse coordinate from pos id.
   * @param id      Should be a valid pos id.
   * @returns
   */
  public revIdx(id: number): Readonly<[r: number, c: number]> {
    return this._idxMap[id]
  }

  public isValidPos(r: number, c: number): boolean {
    return r >= 0 && r < this.MAX_ROW && c >= 0 && c < this.MAX_COL
  }

  public isInvalidPos(r: number, c: number): boolean {
    return r < 0 || r >= this.MAX_ROW || c < 0 || c >= this.MAX_COL
  }

  /**
   *
   * @param id      !!!Should be a valid pos id.
   * @param dirType Moving direction.
   * @param step    !!!Should be a non-negative integer.
   * @returns
   */
  public safeMove(id: number, dirType: GomokuDirectionType, step: number): number | -1 {
    return step <= this._idxMaxMoveMap[dirType][id]
      ? id + this._gomokuDirections[dirType] * step
      : -1
  }

  /**
   *
   * @param id      !!!Should be a valid pos id.
   * @param dirType Moving direction.
   * @returns
   */
  public safeMoveOneStep(id: number, dirType: GomokuDirectionType): number | -1 {
    return 1 <= this._idxMaxMoveMap[dirType][id] ? id + this._gomokuDirections[dirType] : -1
  }

  /**
   * Calculate the pos id after the move.
   * @param id      !!!Should be a valid pos id.
   * @param dirType Moving direction.
   * @param step    Number of steps to move.
   */
  public fastMove(id: number, dirType: GomokuDirectionType, step: number): number {
    return id + this._gomokuDirections[dirType] * step
  }

  /**
   * Calculate the pos id after move one step.
   * @param id      !!!Should be a valid pos id.
   * @param dirType Moving directions.
   */
  public fastMoveOneStep(id: number, dirType: GomokuDirectionType): number {
    return id + this._gomokuDirections[dirType]
  }

  public maxMovableSteps(id: number, dirType: GomokuDirectionType): number {
    return this._idxMaxMoveMap[dirType][id]
  }

  public *validNeighbors(id: number): Iterable<[id2: number, dirType: GomokuDirectionType]> {
    for (const dirType of gomokuDirectionTypes) {
      const id2: number = this.safeMoveOneStep(id, dirType)
      if (id2 >= 0) yield [id2, dirType]
    }
  }

  public hasPlacedNeighbors(id: number): boolean {
    const { board } = this
    for (const dirType of gomokuDirectionTypes) {
      const id2: number = this.safeMoveOneStep(id, dirType)
      if (id2 >= 0 && board[id2] >= 0) return true
    }
    return false
  }

  /**
   * Traverse in the recursive order.
   * @param handle
   */
  public traverseAllDirections(handle: (id: number, dirType: GomokuDirectionType) => void): void {
    this.traverseLeftDirections(handle)
    this.traverseRightDirections(handle)
  }

  public traverseLeftDirections(handle: (id: number, dirType: GomokuDirectionType) => void): void {
    const { TOTAL_POS } = this
    for (const dirType of leftHalfGomokuDirectionTypes) {
      for (let id = 0; id < TOTAL_POS; ++id) handle(id, dirType)
    }
  }

  public traverseRightDirections(handle: (id: number, dirType: GomokuDirectionType) => void): void {
    const { TOTAL_POS } = this
    for (const dirType of rightHalfGomokuDirectionTypes) {
      for (let id = TOTAL_POS - 1; id >= 0; --id) handle(id, dirType)
    }
  }
}
