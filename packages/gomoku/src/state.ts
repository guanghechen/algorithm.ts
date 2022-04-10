import type { IPriorityQueue } from '@algorithm.ts/priority-queue'
import { createPriorityQueue } from '@algorithm.ts/priority-queue'
import type { GomokuDirectionType } from './constant'
import { GomokuDirectionTypeBitset, GomokuDirectionTypes } from './constant'
import type { IGomokuContext } from './context.type'
import type { IGomokuCountMap } from './count-map.type'
import type { IGomokuState } from './state.type'
import type { IDirCounter, IGomokuCandidateState, IGomokuPiece, IShapeScoreMap } from './types'
import { createHighDimensionArray } from './util/createHighDimensionArray'

const { full: fullDirectionTypes, rightHalf: halfDirectionTypes } = GomokuDirectionTypes
const { rightHalf: allDirectionTypeBitset } = GomokuDirectionTypeBitset

export interface IGomokuStateProps {
  context: IGomokuContext
  scoreMap: IShapeScoreMap
  countMap: IGomokuCountMap
}

export class GomokuState implements IGomokuState {
  public readonly NEXT_MOVER_BUFFER = 8
  public readonly context: Readonly<IGomokuContext>
  public readonly countMap: Readonly<IGomokuCountMap>
  public readonly scoreMap: Readonly<IShapeScoreMap>
  protected readonly _candidateQueue: IPriorityQueue<IGomokuCandidateState>
  protected readonly _candidateSet: Set<number>
  protected readonly _candidateScore: number[][] // [playerId][postId] => <candidate score>
  protected readonly _candidateScoreDirMap: number[][][] // [playerId][posId][dirType] => <score>
  protected readonly _candidateScoreExpired: number[] // [posId]  => <expired direction set>
  protected readonly _stateScore: number[] // [playerId] => <state score>
  protected readonly _stateScoreDirMap: number[][][] // [playerId][posId][dirType] => score
  protected readonly _countOfReachFinal: number[] // [playerId] => <count of reach final>
  protected readonly _countOfReachFinalDirMap: number[][][] // [playerId][startPosId][dirType]

  constructor(props: IGomokuStateProps) {
    const { context, countMap, scoreMap } = props

    const _candidateScore: number[][] = createHighDimensionArray(
      () => 0,
      context.TOTAL_PLAYER, // playerId
      context.TOTAL_POS, // posId
    )
    const _candidateScoreDirMap: number[][][] = createHighDimensionArray(
      () => 0,
      context.TOTAL_PLAYER, // playerId
      context.TOTAL_POS, // posId
      fullDirectionTypes.length, // dirType
    )
    const _candidateScoreExpired: number[] = createHighDimensionArray(
      () => allDirectionTypeBitset,
      context.TOTAL_POS,
    )
    const _stateScore: number[] = createHighDimensionArray(() => 0, context.TOTAL_PLAYER)
    const _stateScoreDirMap: number[][][] = createHighDimensionArray(
      () => 0,
      context.TOTAL_PLAYER, // playerId
      context.TOTAL_POS, // posId
      fullDirectionTypes.length, // dirType
    )
    const _countOfReachFinal: number[] = createHighDimensionArray(() => 0, context.TOTAL_PLAYER)
    const _countOfReachFinalDirMap: number[][][] = createHighDimensionArray(
      () => 0,
      context.TOTAL_PLAYER, // playerId
      context.TOTAL_POS, // startPosId
      fullDirectionTypes.length, // dirType
    )

    this.context = context
    this.countMap = countMap
    this.scoreMap = scoreMap
    this._candidateQueue = createPriorityQueue<IGomokuCandidateState>((x, y) => y.score - x.score)
    this._candidateSet = new Set()
    this._candidateScore = _candidateScore
    this._candidateScoreDirMap = _candidateScoreDirMap
    this._candidateScoreExpired = _candidateScoreExpired
    this._stateScore = _stateScore
    this._stateScoreDirMap = _stateScoreDirMap
    this._countOfReachFinal = _countOfReachFinal
    this._countOfReachFinalDirMap = _countOfReachFinalDirMap
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this._candidateSet.clear()
    this._candidateScoreExpired.fill(allDirectionTypeBitset)
    this._stateScore.fill(0)
    this._countOfReachFinal.fill(0)

    const {
      context,
      _stateScore,
      _stateScoreDirMap,
      _countOfReachFinal,
      _countOfReachFinalDirMap,
    } = this
    for (const dirType of halfDirectionTypes) {
      for (const startPosId of context.getStartPosSet(dirType)) {
        const { score: score0, countOfReachFinal: countOfReachFinal0 } =
          this._evaluateScoreInDirection(0, startPosId, dirType)
        const { score: score1, countOfReachFinal: countOfReachFinal1 } =
          this._evaluateScoreInDirection(1, startPosId, dirType)

        _stateScore[0] += score0
        _stateScore[1] += score1
        _stateScoreDirMap[0][startPosId][dirType] = score0
        _stateScoreDirMap[1][startPosId][dirType] = score1

        _countOfReachFinal[0] += countOfReachFinal0
        _countOfReachFinal[1] += countOfReachFinal1
        _countOfReachFinalDirMap[0][startPosId][dirType] = countOfReachFinal0
        _countOfReachFinalDirMap[1][startPosId][dirType] = countOfReachFinal1
      }
    }

    // Initialize candidates.
    const { _candidateSet } = this
    for (const piece of pieces) {
      const centerPosId: number = context.idx(piece.r, piece.c)
      for (const posId of context.accessibleNeighbors(centerPosId)) {
        if (context.board[posId] < 0) _candidateSet.add(posId)
      }
    }
    if (context.board[context.MIDDLE_POS] < 0) _candidateSet.add(context.MIDDLE_POS)
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
    if (context.board[context.MIDDLE_POS] < 0) _candidateSet.add(context.MIDDLE_POS)

    this._updateStateScore(posId)
    this._expireCandidates(posId)
  }

  public expand(
    nextPlayerId: number,
    candidates: IGomokuCandidateState[],
    minMultipleOfTopScore: number,
    MAX_SIZE: number = this.context.TOTAL_POS,
  ): number {
    const topCandidate = this.topCandidate(nextPlayerId)
    if (topCandidate === undefined) return 0
    if (topCandidate.score === Number.MAX_VALUE) {
      // eslint-disable-next-line no-param-reassign
      candidates[0] = topCandidate
      return 1
    }

    const Q = this._candidateQueue
    Q.init()

    let _size = 0
    const { _candidateSet } = this
    for (const posId of _candidateSet) {
      const score: number = this._reEvaluateCandidate(nextPlayerId, posId)
      if (score * minMultipleOfTopScore < topCandidate.score) continue

      if (_size < MAX_SIZE) {
        Q.enqueue({ posId, score })
        _size += 1
      } else {
        const item = Q.top()!
        item.score = score
        Q.replaceTop(item)
      }
    }

    // eslint-disable-next-line no-param-reassign
    for (let i = _size - 1; i >= 0; --i) candidates[i] = Q.dequeue()!
    return _size
  }

  public topCandidate(nextPlayerId: number): IGomokuCandidateState | undefined {
    const { countMap } = this

    const mustDropPos0 = countMap.mustDropPos(nextPlayerId)
    if (mustDropPos0.size > 0) {
      for (const posId of mustDropPos0) return { posId, score: Number.MAX_VALUE }
    }

    const mustDropPos1 = countMap.mustDropPos(nextPlayerId ^ 1)
    if (mustDropPos1.size > 0) {
      for (const posId of mustDropPos1) return { posId, score: Number.MAX_VALUE }
    }

    let item: IGomokuCandidateState | undefined
    const { _candidateSet } = this
    for (const posId of _candidateSet) {
      const score: number = this._reEvaluateCandidate(nextPlayerId, posId)
      if (item === undefined) item = { posId, score }
      else if (item.score < score) item.score = score
    }
    return item
  }

  public score(currentPlayer: number, scoreForPlayer: number): number {
    const score0: number = this._stateScore[scoreForPlayer]
    const score1: number = this._stateScore[scoreForPlayer ^ 1]
    const nextMoverFac = this.NEXT_MOVER_BUFFER
    return currentPlayer === scoreForPlayer
      ? score0 - score1 * nextMoverFac
      : score0 * nextMoverFac - score1
  }

  public isWin(currentPlayer: number): boolean {
    return this._countOfReachFinal[currentPlayer] > 0
  }

  public isDraw(): boolean {
    return this.context.placedCount === this.context.TOTAL_POS
  }

  public isFinal(): boolean {
    const { context, _countOfReachFinal } = this
    if (context.placedCount === context.TOTAL_POS) return true
    if (_countOfReachFinal[0] > 0 || _countOfReachFinal[1] > 0) return true
    return false
  }

  protected _updateStateScore(posId: number): void {
    const {
      context,
      _countOfReachFinal,
      _countOfReachFinalDirMap,
      _stateScore,
      _stateScoreDirMap,
    } = this

    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const { score: score0, countOfReachFinal: countOfReachFinal0 } =
        this._evaluateScoreInDirection(0, startPosId, dirType)
      const { score: score1, countOfReachFinal: countOfReachFinal1 } =
        this._evaluateScoreInDirection(1, startPosId, dirType)

      _stateScore[0] += score0 - _stateScoreDirMap[0][startPosId][dirType]
      _stateScore[1] += score1 - _stateScoreDirMap[1][startPosId][dirType]
      _stateScoreDirMap[0][startPosId][dirType] = score0
      _stateScoreDirMap[1][startPosId][dirType] = score1

      _countOfReachFinal[0] += countOfReachFinal0 - _countOfReachFinalDirMap[0][startPosId][dirType]
      _countOfReachFinal[1] += countOfReachFinal1 - _countOfReachFinalDirMap[1][startPosId][dirType]
      _countOfReachFinalDirMap[0][startPosId][dirType] = countOfReachFinal0
      _countOfReachFinalDirMap[1][startPosId][dirType] = countOfReachFinal1
    }
  }

  protected _expireCandidates(centerPosId: number): void {
    const { context, _candidateScoreExpired } = this
    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(centerPosId, dirType)
      const maxSteps: number = context.maxMovableSteps(startPosId, dirType)
      const bitMark: number = 1 << dirType
      for (let posId = startPosId, step = 0; ; ++step) {
        _candidateScoreExpired[posId] |= bitMark
        if (step === maxSteps) break
        posId = context.fastMoveOneStep(posId, dirType)
      }
    }
  }

  protected _reEvaluateCandidate(nextPlayerId: number, posId: number): number {
    const { NEXT_MOVER_BUFFER, _candidateScore, _candidateScoreExpired } = this
    const expiredBitset = _candidateScoreExpired[posId]

    if (expiredBitset > 0) {
      const { context, _candidateScoreDirMap, _stateScoreDirMap } = this

      let prevScore0 = 0
      let prevScore1 = 0
      for (const dirType of halfDirectionTypes) {
        const startPosId: number = context.getStartPosId(posId, dirType)
        prevScore0 += _stateScoreDirMap[0][startPosId][dirType]
        prevScore1 += _stateScoreDirMap[1][startPosId][dirType]
      }

      let score0 = 0
      this._temporaryForward(posId, 0)
      for (const dirType of halfDirectionTypes) {
        if ((1 << dirType) & expiredBitset) {
          const startPosId: number = context.getStartPosId(posId, dirType)
          const { score } = this._evaluateScoreInDirection(0, startPosId, dirType)
          _candidateScoreDirMap[0][posId][dirType] = score
          score0 += score
        } else score0 += _candidateScoreDirMap[0][posId][dirType]
      }
      this._temporaryRevert(posId)

      let score1 = 0
      this._temporaryForward(posId, 1)
      for (const dirType of halfDirectionTypes) {
        if ((1 << dirType) & expiredBitset) {
          const startPosId: number = context.getStartPosId(posId, dirType)
          const { score } = this._evaluateScoreInDirection(1, startPosId, dirType)
          _candidateScoreDirMap[1][posId][dirType] = score
          score1 += score
        } else score1 += _candidateScoreDirMap[1][posId][dirType]
      }
      this._temporaryRevert(posId)

      const deltaScore0: number = score0 - prevScore0
      const deltaScore1: number = score1 - prevScore1
      _candidateScore[0][posId] = deltaScore0 * NEXT_MOVER_BUFFER + deltaScore1
      _candidateScore[1][posId] = deltaScore0 + deltaScore1 * NEXT_MOVER_BUFFER
      _candidateScoreExpired[posId] = 0
    }
    return _candidateScore[nextPlayerId][posId]
  }

  protected _evaluateScoreInDirection(
    playerId: number,
    startPosId: number,
    dirType: GomokuDirectionType,
  ): { score: number; countOfReachFinal: number } {
    const { context } = this
    const { con, gap } = this.scoreMap
    const { MAX_ADJACENT } = context
    const THRESHOLD: number = MAX_ADJACENT - 1

    const counters: ReadonlyArray<IDirCounter> = context.getDirCounters(startPosId, dirType)
    const _size = counters.length

    let score = 0
    let countOfReachFinal = 0
    for (let i = 0, j: number; i < _size; i = j) {
      for (; i < _size; ++i) {
        if (counters[i].playerId === playerId) break
      }
      if (i === _size) break

      const hasPrefixSpaces: boolean = i > 0 && counters[i - 1].playerId < 0
      let maxPossibleCnt = hasPrefixSpaces ? counters[i - 1].count : 0

      for (j = i; j < _size; ++j) {
        const pid: number = counters[j].playerId
        if (pid >= 0 && pid !== playerId) break
        maxPossibleCnt += counters[j].count
      }

      if (maxPossibleCnt >= MAX_ADJACENT) {
        const i0: number = hasPrefixSpaces ? i - 1 : i
        for (let k = i, usedK = -1, leftPossibleCnt = 0; k < j; k += 2) {
          if (k > i0) leftPossibleCnt += counters[k - 1].count
          const isFreeSide0: 0 | 1 = k > i0 ? 1 : 0
          const cnt1: number = counters[k].count
          if (cnt1 < THRESHOLD && k + 2 < j && counters[k + 1].count === 1) {
            if (k + 1 < j) leftPossibleCnt += counters[k + 1].count
            const cnt2: number = counters[k + 2].count
            if (cnt2 < THRESHOLD) {
              const middleCnt: number = cnt1 + 1 + cnt2
              const rightPossibleCnt: number = maxPossibleCnt - leftPossibleCnt - middleCnt
              const isFreeSide2: 0 | 1 = k + 3 < j ? 1 : 0
              const normalizedCnt: number = Math.min(cnt1 + cnt2, THRESHOLD)
              score +=
                gap[normalizedCnt][isFreeSide0 + isFreeSide2] +
                Math.min(leftPossibleCnt, rightPossibleCnt)
              usedK = k + 2
            }
          }

          if (usedK < k) {
            let normalizedCnt: number = cnt1
            if (cnt1 >= MAX_ADJACENT) {
              normalizedCnt = MAX_ADJACENT
              countOfReachFinal += 1
            }
            const isFreeSide2: 0 | 1 = k + 1 < j ? 1 : 0
            const rightPossibleCnt: number = maxPossibleCnt - leftPossibleCnt - cnt1
            score +=
              con[normalizedCnt][isFreeSide0 + isFreeSide2] +
              Math.min(leftPossibleCnt, rightPossibleCnt)
          }
          leftPossibleCnt += cnt1
        }
      }
    }
    return { score, countOfReachFinal }
  }

  protected _temporaryForward(posId: number, playerId: number): void {
    this.context.forward(posId, playerId)
  }

  protected _temporaryRevert(posId: number): void {
    this.context.revert(posId)
  }
}
