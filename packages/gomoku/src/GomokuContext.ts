import type { GomokuDirectionType } from './constant'
import {
  gomokuDirectionTypes,
  gomokuDirections,
  leftHalfGomokuDirectionTypes,
  rightHalfGomokuDirectionTypes,
} from './constant'

export class GomokuContext {
  public readonly MAX_ROW: number
  public readonly MAX_COL: number
  public readonly MAX_INLINE: number
  public readonly NEXT_MOVER_MAX_BUFFER: number
  public readonly TOTAL_POS: number
  public readonly TOTAL_PLAYERS: number
  protected readonly idxMap: ReadonlyArray<Readonly<[r: number, c: number]>>

  constructor(MAX_ROW: number, MAX_COL: number, MAX_INLINE: number, NEXT_MOVER_MAX_BUFFER = 0.4) {
    const TOTAL_POS = MAX_ROW * MAX_COL
    const idxMap: Array<Readonly<[r: number, c: number]>> = new Array(TOTAL_POS)
    for (let r = 0; r < MAX_ROW; ++r) {
      for (let c = 0; c < MAX_COL; ++c) {
        const id: number = r * MAX_ROW + c
        idxMap[id] = [r, c]
      }
    }

    this.MAX_ROW = MAX_ROW
    this.MAX_COL = MAX_COL
    this.MAX_INLINE = MAX_INLINE
    this.TOTAL_POS = TOTAL_POS
    this.TOTAL_PLAYERS = 2
    this.NEXT_MOVER_MAX_BUFFER = Math.max(0.1, Math.min(0.9, NEXT_MOVER_MAX_BUFFER))
    this.idxMap = idxMap
  }

  public idx(r: number, c: number): number {
    return r * this.MAX_ROW + c
  }

  public idxIfValid(r: number, c: number): number {
    return this.isValidPos(r, c) ? r * this.MAX_ROW + c : -1
  }

  public revIdx(id: number): Readonly<[r: number, c: number]> {
    return this.idxMap[id]
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
    step: number,
  ): [r2: number, c2: number] {
    const [dr, dc] = gomokuDirections[dirType]
    const r2: number = r + dr * step
    const c2: number = c + dc * step
    return [r2, c2]
  }

  public *validNeighbors(
    r: number,
    c: number,
  ): Iterable<[r2: number, c2: number, dirType: GomokuDirectionType]> {
    for (const dirType of gomokuDirectionTypes) {
      const [r2, c2] = this.move(r, c, dirType, 1)
      if (this.isValidPos(r2, c2)) yield [r2, c2, dirType]
    }
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
