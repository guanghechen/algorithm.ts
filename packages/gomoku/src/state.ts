import { GomokuDirectionTypeBitset, GomokuDirectionTypes } from './constant'
import type { GomokuDirectionType } from './constant'
import type { IGomokuContext } from './context.type'
import type { IGomokuState } from './state.type'
import type { IDirCounter, IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'

const { full: fullDirectionTypes, rightHalf: halfDirectionTypes } = GomokuDirectionTypes
const { rightHalf: allDirectionTypeBitset } = GomokuDirectionTypeBitset

type ICountOfReachLimits = [count0: number, count1: number]
type ICountOfReachLimitsDirMap = number[][][] // [playerId][dirType][startPosId]
type IStateScores = [score0: number, score1: number]

export interface IGomokuStateProps {
  context: IGomokuContext
  scoreMap: IScoreMap
  MAX_NEXT_MOVER_BUFFER: number
}

export class GomokuState implements IGomokuState {
  public readonly MAX_NEXT_MOVER_BUFFER: number
  public readonly context: IGomokuContext
  protected readonly _scoreMap: IScoreMap
  protected readonly _countOfReachLimits: ICountOfReachLimits
  protected readonly _countOfReachLimitsDirMap: number[][][] // [dirType][startPosId][playerId]
  protected readonly _stateScoreMap: IStateScores
  protected readonly _stateScoreDirMap: number[][][] // [dirType][startPosId][playerId]
  protected readonly _candidateSet: Set<number>
  protected readonly _candidateScoreMap: number[][] // [posId][playerId]
  protected readonly _candidateScoreDirMap: number[][][] // [dirType][posId][playerId]
  protected readonly _candidateScoreExpired: number[] // [posId]  => expired direction set.
  protected _nextMoverBufferFac: number

  constructor(props: IGomokuStateProps) {
    const { context, scoreMap, MAX_NEXT_MOVER_BUFFER } = props
    const _MAX_NEXT_MOVER_BUFFER = Math.max(0, Math.min(1, MAX_NEXT_MOVER_BUFFER))
    const _countOfReachLimitsDirMap: number[][][] = new Array<number[]>(fullDirectionTypes.length)
      .fill([])
      .map(() => new Array(context.TOTAL_POS).fill([]).map(() => [0, 0]))
    const _stateScoreDirMap: number[][][] = new Array<number[]>(fullDirectionTypes.length)
      .fill([])
      .map(() => new Array(context.TOTAL_POS).fill([]).map(() => [0, 0]))
    const _candidateScoreMap: number[][] = new Array<number[]>(context.TOTAL_POS)
      .fill([])
      .map(() => [0, 0])
    const _candidateScoreDirMap: number[][][] = new Array<number[]>(fullDirectionTypes.length)
      .fill([])
      .map(() => new Array(context.TOTAL_POS).fill([]).map(() => [0, 0]))
    const _candidateScoreExpired: number[] = new Array<number>(context.TOTAL_POS).fill(
      allDirectionTypeBitset,
    )

    this.MAX_NEXT_MOVER_BUFFER = _MAX_NEXT_MOVER_BUFFER
    this.context = context
    this._scoreMap = scoreMap
    this._countOfReachLimits = [0, 0]
    this._countOfReachLimitsDirMap = _countOfReachLimitsDirMap
    this._stateScoreMap = [0, 0]
    this._stateScoreDirMap = _stateScoreDirMap
    this._candidateSet = new Set<number>()
    this._candidateScoreMap = _candidateScoreMap
    this._candidateScoreDirMap = _candidateScoreDirMap
    this._candidateScoreExpired = _candidateScoreExpired
    this._nextMoverBufferFac = 1
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    const {
      context,
      _countOfReachLimits,
      _countOfReachLimitsDirMap,
      _stateScoreMap,
      _stateScoreDirMap,
      _candidateSet,
      _candidateScoreExpired,
    } = this

    _countOfReachLimits.fill(0)
    _stateScoreMap.fill(0)
    for (const dirType of halfDirectionTypes) {
      for (const startPosId of context.getStartPosSet(dirType)) {
        const { scores, countOfReachLimits } = this._evaluateScoreInDirection(startPosId, dirType)

        _countOfReachLimits[0] += countOfReachLimits[0]
        _countOfReachLimits[1] += countOfReachLimits[1]
        _countOfReachLimitsDirMap[dirType][startPosId][0] = countOfReachLimits[0]
        _countOfReachLimitsDirMap[dirType][startPosId][1] = countOfReachLimits[1]

        _stateScoreMap[0] += scores[0]
        _stateScoreMap[1] += scores[1]
        _stateScoreDirMap[dirType][startPosId][0] = scores[0]
        _stateScoreDirMap[dirType][startPosId][1] = scores[1]
      }
    }

    // Initialize candidates.
    _candidateSet.clear()
    for (const { r, c } of pieces) {
      const posId: number = context.idx(r, c)
      for (const posId2 of context.accessibleNeighbors(posId)) {
        if (context.board[posId2] < 0) _candidateSet.add(posId2)
      }
    }

    // Initialize candidateScoreExpired
    for (let posId = 0; posId < context.TOTAL_POS; ++posId) {
      _candidateScoreExpired[posId] = allDirectionTypeBitset
    }
  }

  public forward(posId: number): void {
    const { context, _candidateSet } = this
    _candidateSet.delete(posId)
    for (const posId2 of context.accessibleNeighbors(posId)) {
      if (context.board[posId2] < 0) _candidateSet.add(posId2)
    }
    this._updateStateScore(posId)
    this._expireCandidates(posId)
  }

  public revert(posId: number): void {
    const { context, _candidateSet } = this
    if (context.hasPlacedNeighbors(posId)) _candidateSet.add(posId)
    for (const posId2 of context.accessibleNeighbors(posId)) {
      if (!context.hasPlacedNeighbors(posId2)) _candidateSet.delete(posId2)
    }
    this._updateStateScore(posId)
    this._expireCandidates(posId)
  }

  public expand(nextPlayerId: number, candidates: IGomokuCandidateState[]): void {
    const { context, _candidateSet } = this
    if (context.board[context.MIDDLE_POS] < 0) _candidateSet.add(this.context.MIDDLE_POS)

    // eslint-disable-next-line no-param-reassign
    candidates.length = _candidateSet.size

    let i = 0
    for (const posId of _candidateSet) {
      const score = this._evaluateCandidate(posId, nextPlayerId)
      // eslint-disable-next-line no-param-reassign
      candidates[i] = { id: posId, score }
      i += 1
    }
  }

  public score(currentPlayer: number, scoreForPlayer: number): number {
    const nextMoverFac: number = this._nextMoverBufferFac
    const score0: number = this._stateScoreMap[scoreForPlayer]
    const score1: number = this._stateScoreMap[scoreForPlayer ^ 1]
    return currentPlayer === scoreForPlayer
      ? score0 - score1 * nextMoverFac
      : score0 * nextMoverFac - score1
  }

  public reRandNextMoverBuffer(): void {
    this._nextMoverBufferFac = 1 + Math.random() * this.MAX_NEXT_MOVER_BUFFER
  }

  public isWin(currentPlayer: number): boolean {
    return this._countOfReachLimits[currentPlayer] > 0
  }

  public isDraw(): boolean {
    return this.context.placedCount === this.context.TOTAL_POS
  }

  public isFinal(): boolean {
    const { context, _countOfReachLimits } = this
    if (context.placedCount === context.TOTAL_POS) return true
    if (_countOfReachLimits[0] > 0 || _countOfReachLimits[1] > 0) return true
    return false
  }

  protected _updateStateScore(posId: number): void {
    const {
      context,
      _countOfReachLimits,
      _countOfReachLimitsDirMap,
      _stateScoreMap,
      _stateScoreDirMap,
    } = this

    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const {
        scores: [score0, score1],
        countOfReachLimits: [count0, count1],
      } = this._evaluateScoreInDirection(startPosId, dirType)
      _countOfReachLimits[0] += count0 - _countOfReachLimitsDirMap[dirType][startPosId][0]
      _countOfReachLimits[1] += count1 - _countOfReachLimitsDirMap[dirType][startPosId][1]
      _countOfReachLimitsDirMap[dirType][startPosId][0] = count0
      _countOfReachLimitsDirMap[dirType][startPosId][1] = count1

      _stateScoreMap[0] += score0 - _stateScoreDirMap[dirType][startPosId][0]
      _stateScoreMap[1] += score1 - _stateScoreDirMap[dirType][startPosId][1]
      _stateScoreDirMap[dirType][startPosId][0] = score0
      _stateScoreDirMap[dirType][startPosId][1] = score1
    }
  }

  protected _expireCandidates(posId: number): void {
    const { context, _candidateScoreExpired } = this

    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const maxSteps: number = context.maxMovableSteps(startPosId, dirType)
      const bitMark: number = 1 << dirType
      for (let id = startPosId, step = 0; ; ++step) {
        _candidateScoreExpired[id] |= bitMark
        if (step === maxSteps) break
        id = context.fastMoveOneStep(id, dirType)
      }
    }
  }

  protected _evaluateCandidate(posId: number, nextPlayerId: number): number {
    const { _candidateScoreExpired, _candidateScoreMap } = this
    const expiredBitset: number = _candidateScoreExpired[posId]
    if (expiredBitset > 0) {
      const { context, _candidateScoreDirMap, _stateScoreDirMap } = this

      let prevScore0 = 0
      let prevScore1 = 0
      for (const dirType of halfDirectionTypes) {
        const startPosId: number = context.getStartPosId(posId, dirType)
        prevScore0 += _stateScoreDirMap[dirType][startPosId][0]
        prevScore1 += _stateScoreDirMap[dirType][startPosId][1]
      }

      let score0 = 0
      context.forward(posId, 0)
      for (const dirType of halfDirectionTypes) {
        if ((1 << dirType) & expiredBitset) {
          const startPosId: number = context.getStartPosId(posId, dirType)
          const { scores } = this._evaluateScoreInDirection(startPosId, dirType)
          _candidateScoreDirMap[dirType][posId][0] = scores[0]
          score0 += scores[0]
        } else {
          score0 += _candidateScoreDirMap[dirType][posId][0]
        }
      }
      context.revert(posId)

      let score1 = 0
      context.forward(posId, 1)
      for (const dirType of halfDirectionTypes) {
        if ((1 << dirType) & expiredBitset) {
          const startPosId: number = context.getStartPosId(posId, dirType)
          const { scores } = this._evaluateScoreInDirection(startPosId, dirType)
          _candidateScoreDirMap[dirType][posId][1] = scores[1]
          score1 += scores[1]
        } else {
          score1 += _candidateScoreDirMap[dirType][posId][1]
        }
      }
      context.revert(posId)

      const deltaScore0: number = score0 - prevScore0
      const deltaScore1: number = score1 - prevScore1
      const baseScore: number = deltaScore0 + deltaScore1
      _candidateScoreMap[posId][0] = baseScore + deltaScore0
      _candidateScoreMap[posId][1] = baseScore + deltaScore1
      _candidateScoreExpired[posId] = 0
    }
    return _candidateScoreMap[posId][nextPlayerId]
  }

  protected _evaluateScoreInDirection(
    startPosId: number,
    dirType: GomokuDirectionType,
  ): { scores: IStateScores; countOfReachLimits: ICountOfReachLimits } {
    const {
      context,
      _scoreMap: { con, gap },
    } = this
    const { MAX_ADJACENT } = context
    const THRESHOLD: number = MAX_ADJACENT - 1

    const counters: ReadonlyArray<IDirCounter> = context.getDirCounters(startPosId, dirType)
    const _size = counters.length

    const scores: IStateScores = [0, 0]
    const countOfReachLimits: ICountOfReachLimits = [0, 0]
    for (let i = 0, j: number, k: number; i < _size; i = j) {
      if (i > 0 && counters[i - 1].playerId < 0) i -= 1
      k = i
      j = i

      let { playerId, count: maxPossibleCnt } = counters[j]
      if (playerId < 0) {
        // eslint-disable-next-line no-plusplus
        if (++j === _size) break
        const { playerId: playerId2, count: cnt } = counters[j]
        playerId = playerId2
        maxPossibleCnt += cnt
        k += 1
      }

      for (j += 1; j < _size; ++j) {
        const { playerId: playerId2, count: cnt } = counters[j]
        if (playerId2 >= 0 && playerId2 !== playerId) break
        maxPossibleCnt += cnt
      }

      if (maxPossibleCnt >= MAX_ADJACENT) {
        let isFreeSide0: 0 | 1 = k > i ? 1 : 0
        for (let usedK = -1; k < j; k += 2, isFreeSide0 = 1) {
          const cnt1: number = counters[k].count
          if (cnt1 < THRESHOLD && k + 2 < j && counters[k + 1].count === 1) {
            const cnt2: number = counters[k + 2].count
            if (cnt2 < THRESHOLD) {
              const isFreeSide2: 0 | 1 = k + 3 < j ? 1 : 0
              const normalizedCnt: number = Math.min(cnt1 + cnt2, THRESHOLD)
              scores[playerId] += gap[normalizedCnt][isFreeSide0 + isFreeSide2]
              usedK = k + 2
              continue
            }
          }

          if (usedK !== k) {
            let normalizedCnt: number = cnt1
            if (cnt1 >= MAX_ADJACENT) {
              normalizedCnt = MAX_ADJACENT
              countOfReachLimits[playerId] += 1
            }
            const isFreeSide2: 0 | 1 = k + 1 < j ? 1 : 0
            scores[playerId] += con[normalizedCnt][isFreeSide0 + isFreeSide2]
          }
        }
      }
    }
    return { scores, countOfReachLimits }
  }
}
