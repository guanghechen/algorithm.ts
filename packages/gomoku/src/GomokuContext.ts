import type { GomokuDirectionType } from './constant'
import {
  gomokuDirectionTypes,
  gomokuDirections,
  leftHalfGomokuDirectionTypes,
  rightHalfGomokuDirectionTypes,
} from './constant'
import type { IGomokuBoard } from './types'

export class GomokuContext {
  public readonly MAX_ROW: number
  public readonly MAX_COL: number
  public readonly MAX_INLINE: number
  public readonly TOTAL_POS: number
  public readonly TOTAL_PLAYERS: number
  public readonly board: Readonly<IGomokuBoard>

  constructor(MAX_ROW: number, MAX_COL: number, MAX_INLINE: number) {
    this.MAX_ROW = MAX_ROW
    this.MAX_COL = MAX_COL
    this.MAX_INLINE = MAX_INLINE
    this.TOTAL_POS = MAX_ROW * MAX_COL
    this.TOTAL_PLAYERS = 2
    this.board = new Int32Array(this.TOTAL_POS)
  }

  public idx(r: number, c: number): number {
    return r * this.MAX_ROW + c
  }

  public idxIfValid(r: number, c: number): number {
    return this.isValidPos(r, c) ? r * this.MAX_ROW + c : -1
  }

  public reIdx(id: number): [r: number, c: number] {
    const c: number = id % this.MAX_ROW
    const r: number = Math.round((id - c) / this.MAX_ROW)
    return [r, c]
  }

  public isValidPos(r: number, c: number): boolean {
    return r >= 0 && r < this.MAX_ROW && c >= 0 && c < this.MAX_COL
  }

  public isInvalidPos(r: number, c: number): boolean {
    return r < 0 || r >= this.MAX_ROW || c < 0 || c >= this.MAX_COL
  }

  public move(
    r: number,
    c: number,
    dirType: GomokuDirectionType,
    step = 1,
  ): [r2: number, c2: number] {
    const [dr, dc] = gomokuDirections[dirType]
    const r2: number = r + dr * step
    const c2: number = c + dc * step
    return [r2, c2]
  }

  public visitValidNeighbors(
    r: number,
    c: number,
    touch: (r2: number, c2: number, dirType: GomokuDirectionType) => void,
  ): void {
    for (const dirType of gomokuDirectionTypes) {
      const [r2, c2] = this.move(r, c, dirType)
      if (this.isValidPos(r2, c2)) touch(r2, c2, dirType)
    }
  }

  public hasPlacedNeighbors(r: number, c: number): boolean {
    const { board } = this
    for (const dirType of gomokuDirectionTypes) {
      const [r2, c2] = this.move(r, c, dirType)
      if (this.isValidPos(r2, c2)) {
        const id2: number = this.idx(r2, c2)
        if (board[id2] >= 0) return true
      }
    }
    return false
  }

  /**
   * Traverse in the recursive order.
   * @param handle
   */
  public traverseAllDirections(
    handle: (r: number, c: number, dirType: GomokuDirectionType) => void,
  ): void {
    this.traverseLeftDirections(handle)
    this.traverseRightDirections(handle)
  }

  public traverseLeftDirections(
    handle: (r: number, c: number, dirType: GomokuDirectionType) => void,
  ): void {
    const { MAX_ROW, MAX_COL } = this
    for (const dirType of leftHalfGomokuDirectionTypes) {
      for (let r = 0; r < MAX_ROW; ++r) {
        for (let c = 0; c < MAX_COL; ++c) handle(r, c, dirType)
      }
    }
  }

  public traverseRightDirections(
    handle: (r: number, c: number, dirType: GomokuDirectionType) => void,
  ): void {
    const { MAX_ROW, MAX_COL } = this
    const R: number = MAX_ROW - 1
    const C: number = MAX_COL - 1
    for (const dirType of rightHalfGomokuDirectionTypes) {
      for (let r = R; r >= 0; --r) {
        for (let c = C; c >= 0; --c) handle(r, c, dirType)
      }
    }
  }
}
