import { GomokuDirectionTypes, GomokuDirections } from './constant'
import type { GomokuDirectionType } from './constant'
import type { IGomokuContext } from './context.type'
import type { IGomokuBoard, IGomokuPiece } from './types'

const { full: fullDirectionTypes } = GomokuDirectionTypes

type IGomokuDirections = number[]
type IIdxMap = Array<Readonly<[r: number, c: number]>>

export interface IGomokuContextProps {
  MAX_ROW: number
  MAX_COL: number
  MAX_ADJACENT: number
  MAX_DISTANCE_OF_NEIGHBOR: number
}

export class GomokuContext implements IGomokuContext {
  public readonly MAX_ROW: number
  public readonly MAX_COL: number
  public readonly MAX_ADJACENT: number
  public readonly MAX_DISTANCE_OF_NEIGHBOR: number
  public readonly TOTAL_POS: number
  public readonly MIDDLE_POS: number
  public readonly board: Readonly<IGomokuBoard>
  public readonly idx: (r: number, c: number) => number
  protected readonly _idxMap: Readonly<IIdxMap>
  protected readonly _gomokuDirections: Readonly<IGomokuDirections>
  protected readonly _maxMovableMap: number[][] // [dirType][posId] => MAX_MOVABLE_STEPS
  protected readonly _dirStartPosMap: number[][] // [dirType][posId] => startPosId
  protected readonly _dirStartPosSet: number[][] // [dirType] => <start posIds>
  protected readonly _dirNeighborSet: number[][] // [posId] => <neighbors of posId>
  protected readonly _neighborPlacedCount: number[]
  protected _placedCount: number

  constructor(props: IGomokuContextProps) {
    const { MAX_ROW, MAX_COL, MAX_ADJACENT, MAX_DISTANCE_OF_NEIGHBOR } = props
    const _MAX_ROW: number = Math.max(1, MAX_ROW)
    const _MAX_COL: number = Math.max(1, MAX_COL)
    const _MAX_ADJACENT: number = Math.max(1, MAX_ADJACENT)
    const _MAX_DISTANCE_OF_NEIGHBOR: number = Math.max(1, MAX_DISTANCE_OF_NEIGHBOR)
    const _TOTAL_POS: number = _MAX_ROW * _MAX_COL
    const idx = (r: number, c: number): number => r * _MAX_ROW + c

    this.MAX_ROW = _MAX_ROW
    this.MAX_COL = _MAX_COL
    this.MAX_ADJACENT = _MAX_ADJACENT
    this.MAX_DISTANCE_OF_NEIGHBOR = _MAX_DISTANCE_OF_NEIGHBOR
    this.TOTAL_POS = _TOTAL_POS
    this.MIDDLE_POS = _TOTAL_POS >> 1
    this.board = new Array(_TOTAL_POS).fill(-1)
    this.idx = idx

    const _idxMap: IIdxMap = new Array(_TOTAL_POS)
    for (let r = 0; r < _MAX_ROW; ++r) {
      for (let c = 0; c < _MAX_COL; ++c) {
        const posId: number = idx(r, c)
        _idxMap[posId] = [r, c]
      }
    }

    const _gomokuDirections: IGomokuDirections = GomokuDirections.map(
      ([dr, dc]) => dr * MAX_ROW + dc,
    )

    const _maxMovableMap: number[][] = new Array(fullDirectionTypes.length)
      .fill([])
      .map(() => new Array(_TOTAL_POS).fill(0))
    const _dirStartPosSet: number[][] = new Array(fullDirectionTypes.length).fill([]).map(() => [])
    const _dirStartPosMap: number[][] = new Array(fullDirectionTypes.length)
      .fill([])
      .map(() => new Array(_TOTAL_POS).fill(0))
    this.traverseAllDirections(dirType => {
      const revDirType: GomokuDirectionType = dirType ^ 1
      const [dr, dc] = GomokuDirections[dirType]
      return posId => {
        const [r, c] = _idxMap[posId]
        const r2 = r + dr
        const c2 = c + dc
        if (r2 < 0 || r2 >= _MAX_ROW || c2 < 0 || c2 >= _MAX_ROW) {
          _maxMovableMap[dirType][posId] = 0
          _dirStartPosMap[revDirType][posId] = posId
          _dirStartPosSet[revDirType].push(posId)
        } else {
          const posId2 = idx(r2, c2)
          _maxMovableMap[dirType][posId] = _maxMovableMap[dirType][posId2] + 1
          _dirStartPosMap[revDirType][posId] = _dirStartPosMap[revDirType][posId2]
        }
      }
    })

    const _neighborMap: number[][] = new Array(_TOTAL_POS)
    for (let posId = 0; posId < _TOTAL_POS; ++posId) {
      const neighbors: number[] = []
      _neighborMap[posId] = neighbors
      for (const dirType of fullDirectionTypes) {
        let posId2: number = posId
        for (let step = 0; step < _MAX_DISTANCE_OF_NEIGHBOR; ++step) {
          if (1 > _maxMovableMap[dirType][posId2]) break
          posId2 += _gomokuDirections[dirType]
          neighbors.push(posId2)
        }
      }
    }

    this._gomokuDirections = _gomokuDirections
    this._idxMap = _idxMap
    this._maxMovableMap = _maxMovableMap
    this._dirStartPosMap = _dirStartPosMap
    this._dirStartPosSet = _dirStartPosSet
    this._dirNeighborSet = _neighborMap
    this._neighborPlacedCount = new Array(_TOTAL_POS).fill(0)
    this._placedCount = 0
  }

  public get placedCount(): number {
    return this._placedCount
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    const board = this.board as IGomokuBoard
    board.fill(-1)
    this._placedCount = 0

    // Update _neighborPlacedCount
    const { _neighborPlacedCount } = this
    _neighborPlacedCount.fill(0)
    for (const { r, c, p } of pieces) {
      const posId: number = this.idx(r, c)
      if (board[posId] < 0) {
        board[posId] = p
        this._placedCount += 1
        for (const neighborId of this.accessibleNeighbors(posId)) {
          _neighborPlacedCount[neighborId] += 1
        }
      }
    }
  }

  public forward(posId: number, playerId: number): boolean {
    const board = this.board as IGomokuBoard
    if (posId < 0 || posId >= this.TOTAL_POS || board[posId] >= 0) return false

    board[posId] = playerId
    this._placedCount += 1

    // Update _neighborPlacedCount
    for (const neighborId of this.accessibleNeighbors(posId)) {
      this._neighborPlacedCount[neighborId] += 1
    }
    return true
  }

  public revert(posId: number): boolean {
    const board = this.board as IGomokuBoard
    if (posId < 0 || posId >= this.TOTAL_POS || board[posId] < 0) return false

    board[posId] = -1
    this._placedCount -= 1

    // Update _neighborPlacedCount
    for (const neighborId of this.accessibleNeighbors(posId)) {
      this._neighborPlacedCount[neighborId] -= 1
    }
    return true
  }

  public revIdx(posId: number): Readonly<[r: number, c: number]> {
    return this._idxMap[posId]
  }

  public isValidPos(r: number, c: number): boolean {
    return r >= 0 && r < this.MAX_ROW && c >= 0 && c < this.MAX_COL
  }

  public safeMove(posId: number, dirType: GomokuDirectionType, step: number): number {
    return step <= this._maxMovableMap[dirType][posId]
      ? posId + this._gomokuDirections[dirType] * step
      : -1
  }

  public safeMoveOneStep(posId: number, dirType: GomokuDirectionType): number {
    return 1 <= this._maxMovableMap[dirType][posId] ? posId + this._gomokuDirections[dirType] : -1
  }

  public fastMove(posId: number, dirType: GomokuDirectionType, step: number): number {
    return posId + this._gomokuDirections[dirType] * step
  }

  public fastMoveOneStep(posId: number, dirType: GomokuDirectionType): number {
    return posId + this._gomokuDirections[dirType]
  }

  public maxMovableSteps(posId: number, dirType: GomokuDirectionType): number {
    return this._maxMovableMap[dirType][posId]
  }

  public accessibleNeighbors(posId: number): Iterable<number> {
    return this._dirNeighborSet[posId]
  }

  public hasPlacedNeighbors(posId: number): boolean {
    return this._neighborPlacedCount[posId] > 0
  }

  public getStartPosId(posId: number, dirType: GomokuDirectionType): number {
    return this._dirStartPosMap[dirType][posId]
  }

  public getStartPosSet(dirType: GomokuDirectionType): Iterable<number> {
    return this._dirStartPosSet[dirType]
  }

  public traverseAllDirections(
    handle: (dirType: GomokuDirectionType) => (posId: number) => void,
  ): void {
    const { TOTAL_POS } = this
    const { leftHalf, rightHalf } = GomokuDirectionTypes
    for (const dirType of leftHalf) {
      const h = handle(dirType)
      for (let posId = 0; posId < TOTAL_POS; ++posId) h(posId)
    }
    for (const dirType of rightHalf) {
      const h = handle(dirType)
      for (let posId = TOTAL_POS - 1; posId >= 0; --posId) h(posId)
    }
  }
}