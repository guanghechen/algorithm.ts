import { gomokuDirectionTypes, leftHalfGomokuDirectionTypes } from './constant'
import type { GomokuDirectionType } from './constant'
import type { IGomokuContext } from './context.type'
import type { IGomokuState } from './state.type'
import type { IDirCounter, IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'

type ICountOfReachLimits = [count0: number, count1: number]
type ICountOfReachLimitsDirMap = number[][][] // [playerId][dirType][startPosId]
type IStateScores = [score0: number, score1: number]
type IStateScoresDirMap = number[][][] // [playerId][dirType][startPosId]

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
  protected readonly _countOfReachLimitsDirMap: ICountOfReachLimitsDirMap
  protected readonly _stateScores: IStateScores
  protected readonly _stateScoresDirMap: IStateScoresDirMap
  protected readonly _candidateSet: Set<number>
  protected _nextMoverBufferFac: number

  constructor(props: IGomokuStateProps) {
    const { context, scoreMap, MAX_NEXT_MOVER_BUFFER } = props
    const _MAX_NEXT_MOVER_BUFFER = Math.max(0, Math.min(1, MAX_NEXT_MOVER_BUFFER))
    const _countOfReachLimitsDirMap: ICountOfReachLimitsDirMap = new Array<number[][]>(2)
      .fill([])
      .map(() =>
        new Array<number[]>(gomokuDirectionTypes.length)
          .fill([])
          .map(() => new Array<number>(context.TOTAL_POS)),
      )
    const _dirStateScoreMap: IStateScoresDirMap = new Array<number[][]>(2)
      .fill([])
      .map(() =>
        new Array<number[]>(gomokuDirectionTypes.length)
          .fill([])
          .map(() => new Array<number>(context.TOTAL_POS)),
      )

    this.MAX_NEXT_MOVER_BUFFER = _MAX_NEXT_MOVER_BUFFER
    this.context = context
    this._scoreMap = scoreMap
    this._countOfReachLimits = [0, 0]
    this._countOfReachLimitsDirMap = _countOfReachLimitsDirMap
    this._stateScores = [0, 0]
    this._stateScoresDirMap = _dirStateScoreMap
    this._candidateSet = new Set<number>()
    this._nextMoverBufferFac = 1
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    const {
      context,
      _countOfReachLimits,
      _countOfReachLimitsDirMap,
      _stateScores,
      _stateScoresDirMap,
      _candidateSet,
    } = this

    _countOfReachLimits.fill(0)
    _stateScores.fill(0)
    for (const dirType of leftHalfGomokuDirectionTypes) {
      _countOfReachLimitsDirMap[0][dirType].fill(0)
      _countOfReachLimitsDirMap[1][dirType].fill(0)
      _stateScoresDirMap[0][dirType].fill(0)
      _stateScoresDirMap[1][dirType].fill(0)

      for (const startPosId of context.getStartPosSet(dirType)) {
        const { scores, countOfReachLimits } = this._evaluateScoreInDirection(startPosId, dirType)

        _countOfReachLimits[0] += countOfReachLimits[0]
        _countOfReachLimits[1] += countOfReachLimits[1]
        _countOfReachLimitsDirMap[0][dirType][startPosId] = countOfReachLimits[0]
        _countOfReachLimitsDirMap[1][dirType][startPosId] = countOfReachLimits[1]

        _stateScores[0] += scores[0]
        _stateScores[1] += scores[1]
        _stateScoresDirMap[0][dirType][startPosId] = scores[0]
        _stateScoresDirMap[1][dirType][startPosId] = scores[1]
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
  }

  public forward(posId: number): void {
    const { context, _candidateSet } = this
    this._updateStateScore(posId)
    _candidateSet.delete(posId)
    for (const posId2 of context.accessibleNeighbors(posId)) {
      if (context.board[posId2] < 0) _candidateSet.add(posId2)
    }
  }

  public revert(posId: number): void {
    const { context, _candidateSet } = this
    this._updateStateScore(posId)
    if (context.hasPlacedNeighbors(posId)) _candidateSet.add(posId)
    for (const posId2 of context.accessibleNeighbors(posId)) {
      if (context.board[posId2] >= 0) _candidateSet.delete(posId2)
    }
  }

  public expand(nextPlayer: number, candidates: IGomokuCandidateState[]): void {
    const { context, _candidateSet } = this
    if (context.board[context.MIDDLE_POS] < 0) _candidateSet.add(this.context.MIDDLE_POS)

    // eslint-disable-next-line no-param-reassign
    candidates.length = _candidateSet.size

    let i = 0
    for (const posId of _candidateSet) {
      const score = this._evaluateCandidate(nextPlayer, posId)
      // eslint-disable-next-line no-param-reassign
      candidates[i] = { id: posId, score }
      i += 1
    }
  }

  public score(currentPlayer: number, scoreForPlayer: number): number {
    const nextMoverFac: number = this._nextMoverBufferFac
    const score0: number = this._stateScores[scoreForPlayer]
    const score1: number = this._stateScores[scoreForPlayer ^ 1]
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
    return (
      this.context.placedCount === this.context.TOTAL_POS &&
      this._countOfReachLimits[0] <= 0 &&
      this._countOfReachLimits[1] <= 0
    )
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
      _stateScores,
      _stateScoresDirMap,
    } = this

    for (const dirType of leftHalfGomokuDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const {
        scores: [score0, score1],
        countOfReachLimits: [count0, count1],
      } = this._evaluateScoreInDirection(startPosId, dirType)
      _countOfReachLimits[0] += count0 - _countOfReachLimitsDirMap[0][dirType][startPosId]
      _countOfReachLimits[1] += count1 - _countOfReachLimitsDirMap[1][dirType][startPosId]
      _countOfReachLimitsDirMap[0][dirType][startPosId] = count0
      _countOfReachLimitsDirMap[1][dirType][startPosId] = count1

      _stateScores[0] += score0 - _stateScoresDirMap[0][dirType][startPosId]
      _stateScores[1] += score1 - _stateScoresDirMap[1][dirType][startPosId]
      _stateScoresDirMap[0][dirType][startPosId] = score0
      _stateScoresDirMap[1][dirType][startPosId] = score1
    }
  }

  protected _evaluateCandidate(playerId: number, posId: number): number {
    const { context, _stateScoresDirMap, _nextMoverBufferFac } = this

    let score0 = 0
    let score1 = 0
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      score0 -= _stateScoresDirMap[playerId][dirType][startPosId]
      score1 -= _stateScoresDirMap[playerId ^ 1][dirType][startPosId]
    }

    context.forward(posId, playerId)
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const { scores } = this._evaluateScoreInDirection(startPosId, dirType)
      score0 += scores[playerId]
      score1 += scores[playerId ^ 1]
    }
    context.revert(posId)

    const score: number = score0 - score1 * _nextMoverBufferFac
    return score
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
