import type { IPriorityQueue } from '@algorithm.ts/queue'
import { PriorityQueue } from '@algorithm.ts/queue'
import type { GomokuDirectionType } from '../constant'
import { GomokuDirectionTypeBitset, GomokuDirectionTypes } from '../constant'
import type {
  IDirCounter,
  IGomokuCandidateState,
  IGomokuPiece,
  IShapeScoreMap,
} from '../types/misc'
import type { IGomokuMoverContext } from '../types/mover-context'
import type { IGomokuMoverCounter } from '../types/mover-counter'
import type { IGomokuMoverState } from '../types/mover-state'
import { createHighDimensionArray } from '../util/createHighDimensionArray'

const { full: fullDirectionTypes, rightHalf: halfDirectionTypes } = GomokuDirectionTypes
const { rightHalf: allDirectionTypeBitset } = GomokuDirectionTypeBitset

export interface IGomokuStateProps {
  context: Readonly<IGomokuMoverContext>
  counter: Readonly<IGomokuMoverCounter>
  scoreMap: Readonly<IShapeScoreMap>
}

export class GomokuMoverState implements IGomokuMoverState {
  public readonly NEXT_MOVER_BUFFER = 4
  public readonly context: Readonly<IGomokuMoverContext>
  public readonly counter: Readonly<IGomokuMoverCounter>
  public readonly scoreMap: Readonly<IShapeScoreMap>
  protected readonly _candidateQueues: Array<IPriorityQueue<IGomokuCandidateState>>
  protected readonly _candidateInqSets: Array<Array<Set<number>>>
  protected readonly _candidateSet: Set<number>
  protected readonly _candidateScores: number[][] // [playerId][postId] => <candidate score>
  protected readonly _candidateScoreDirMap: number[][][] // [playerId][posId][dirType] => <score>
  protected readonly _candidateScoreExpired: number[] // [posId]  => <expired direction set>
  protected readonly _stateScores: number[] // [playerId] => <state score>
  protected readonly _stateScoreDirMap: number[][][] // [playerId][posId][dirType] => score
  protected readonly _countOfReachFinal: number[] // [playerId] => <count of reach final>
  protected readonly _countOfReachFinalDirMap: number[][][] // [playerId][startPosId][dirType]

  constructor(props: IGomokuStateProps) {
    const { context, counter, scoreMap } = props

    const _candidateQueues: Array<IPriorityQueue<IGomokuCandidateState>> = createHighDimensionArray(
      () => new PriorityQueue<IGomokuCandidateState>({ compare: (x, y) => y.score - x.score }),
      context.TOTAL_PLAYER, // playerId
    )
    const _candidateInqSets: Array<Array<Set<number>>> = createHighDimensionArray(
      () => new Set(),
      context.TOTAL_PLAYER, // playerId
      context.TOTAL_POS, // posId
    )
    const _candidateSet: Set<number> = new Set()
    const _candidateScores: number[][] = createHighDimensionArray(
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
    const _stateScores: number[] = createHighDimensionArray(() => 0, context.TOTAL_PLAYER)
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
    this.counter = counter
    this.scoreMap = scoreMap
    this._candidateQueues = _candidateQueues
    this._candidateInqSets = _candidateInqSets
    this._candidateSet = _candidateSet
    this._candidateScores = _candidateScores
    this._candidateScoreDirMap = _candidateScoreDirMap
    this._candidateScoreExpired = _candidateScoreExpired
    this._stateScores = _stateScores
    this._stateScoreDirMap = _stateScoreDirMap
    this._countOfReachFinal = _countOfReachFinal
    this._countOfReachFinalDirMap = _countOfReachFinalDirMap
  }

  public init(pieces: Iterable<IGomokuPiece>): void {
    this._candidateQueues.forEach(Q => Q.init())
    this._candidateInqSets.forEach(inqSets => inqSets.forEach(inqSet => inqSet.clear()))
    this._candidateSet.clear()
    this._candidateScoreExpired.fill(allDirectionTypeBitset)
    this._stateScores.fill(0)
    this._countOfReachFinal.fill(0)

    const {
      context,
      _stateScores,
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

        _stateScores[0] += score0
        _stateScores[1] += score1
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
    for (const posId of _candidateSet) this._reEvaluateAndEnqueueCandidate(posId)
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

    if (context.board[context.MIDDLE_POS] < 0 && !_candidateSet.has(context.MIDDLE_POS)) {
      _candidateSet.add(context.MIDDLE_POS)
      this._reEvaluateAndEnqueueCandidate(context.MIDDLE_POS)
    }
  }

  public expand(
    nextPlayerId: number,
    candidates: IGomokuCandidateState[],
    candidateGrowthFactor: number,
    MAX_SIZE: number = this.context.TOTAL_POS,
  ): number {
    const topCandidate = this.topCandidate(nextPlayerId)
    if (topCandidate === undefined) return 0
    if (topCandidate.score === Number.MAX_VALUE) {
      // eslint-disable-next-line no-param-reassign
      candidates[0] = topCandidate
      return 1
    }

    const topScore: number = topCandidate.score
    const { _candidateScoreExpired } = this
    const Q = this._candidateQueues[nextPlayerId]
    const inqSets: Array<Set<number>> = this._candidateInqSets[nextPlayerId]
    const candidateScores = this._candidateScores[nextPlayerId]

    let _size = 0
    let item: IGomokuCandidateState | undefined
    for (; _size < MAX_SIZE; ) {
      item = Q.dequeue()
      if (item === undefined) break

      if (_candidateScoreExpired[item.posId] === 0 && item.score === candidateScores[item.posId]) {
        if (item.score * candidateGrowthFactor < topScore) {
          Q.enqueue(item)
          break
        }

        // eslint-disable-next-line no-param-reassign, no-plusplus
        candidates[_size++] = item
      } else {
        inqSets[item.posId].delete(item.score)
      }
    }

    if (Q.size > this.context.TOTAL_POS) {
      Q.exclude(item => {
        if (_candidateScoreExpired[item.posId] > 0 || item.score !== candidateScores[item.posId]) {
          inqSets[item.posId].delete(item.score)
          return true
        }
        return false
      })
    }

    // eslint-disable-next-line no-param-reassign
    candidates.length = _size
    Q.enqueues(candidates)
    return _size
  }

  public topCandidate(nextPlayerId: number): IGomokuCandidateState | undefined {
    const mustDropPos0 = this.counter.mustWinPosSet(nextPlayerId)
    if (mustDropPos0.size > 0) {
      for (const posId of mustDropPos0) return { posId, score: Number.MAX_VALUE }
    }

    const mustDropPos1 = this.counter.mustWinPosSet(nextPlayerId ^ 1)
    if (mustDropPos1.size > 0) {
      for (const posId of mustDropPos1) return { posId, score: Number.MAX_VALUE }
    }

    const { _candidateScoreExpired } = this
    const Q = this._candidateQueues[nextPlayerId]
    const inqSets: Array<Set<number>> = this._candidateInqSets[nextPlayerId]
    const candidateScores = this._candidateScores[nextPlayerId]

    let item: IGomokuCandidateState | undefined
    for (;;) {
      item = Q.dequeue()
      if (item === undefined) break

      inqSets[item.posId].delete(item.score)
      if (_candidateScoreExpired[item.posId] === 0 && item.score === candidateScores[item.posId]) {
        break
      }
    }

    if (item !== undefined) {
      Q.enqueue(item)
      inqSets[item.posId].add(item.score)
    }
    return item
  }

  public score(currentPlayer: number, scoreForPlayer: number): number {
    const score0: number = this._stateScores[scoreForPlayer]
    const score1: number = this._stateScores[scoreForPlayer ^ 1]
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
      _stateScores,
      _stateScoreDirMap,
    } = this

    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const { score: score0, countOfReachFinal: countOfReachFinal0 } =
        this._evaluateScoreInDirection(0, startPosId, dirType)
      const { score: score1, countOfReachFinal: countOfReachFinal1 } =
        this._evaluateScoreInDirection(1, startPosId, dirType)

      _stateScores[0] += score0 - _stateScoreDirMap[0][startPosId][dirType]
      _stateScores[1] += score1 - _stateScoreDirMap[1][startPosId][dirType]
      _stateScoreDirMap[0][startPosId][dirType] = score0
      _stateScoreDirMap[1][startPosId][dirType] = score1

      _countOfReachFinal[0] += countOfReachFinal0 - _countOfReachFinalDirMap[0][startPosId][dirType]
      _countOfReachFinal[1] += countOfReachFinal1 - _countOfReachFinalDirMap[1][startPosId][dirType]
      _countOfReachFinalDirMap[0][startPosId][dirType] = countOfReachFinal0
      _countOfReachFinalDirMap[1][startPosId][dirType] = countOfReachFinal1
    }
  }

  protected _expireCandidates(centerPosId: number): void {
    const { context, _candidateSet, _candidateScoreExpired } = this
    for (const dirType of halfDirectionTypes) {
      const startPosId: number = context.getStartPosId(centerPosId, dirType)
      const maxSteps: number = context.maxMovableSteps(startPosId, dirType)
      const bitMark: number = 1 << dirType
      for (let posId = startPosId, step = 0; ; ++step) {
        _candidateScoreExpired[posId] |= bitMark
        if (posId !== centerPosId && _candidateSet.has(posId)) {
          this._reEvaluateAndEnqueueCandidate(posId)
        }

        if (step === maxSteps) break
        posId = context.fastMoveOneStep(posId, dirType)
      }
    }
    if (_candidateSet.has(centerPosId)) this._reEvaluateAndEnqueueCandidate(centerPosId)
  }

  protected _reEvaluateAndEnqueueCandidate(posId: number): void {
    this._reEvaluateCandidate(posId)

    const candidateScore0: number = this._candidateScores[0][posId]
    const inq0: Set<number> = this._candidateInqSets[0][posId]
    if (!inq0.has(candidateScore0)) {
      inq0.add(candidateScore0)
      this._candidateQueues[0].enqueue({ posId, score: candidateScore0 })
    }

    const candidateScore1: number = this._candidateScores[1][posId]
    const inq1: Set<number> = this._candidateInqSets[1][posId]
    if (!inq1.has(candidateScore1)) {
      inq1.add(candidateScore1)
      this._candidateQueues[1].enqueue({ posId, score: candidateScore1 })
    }
  }

  protected _reEvaluateCandidate(posId: number): void {
    // invariant(this.context.board[postId] < 0, `[_reEvaluateCandidate] Bad posId(${posId})`)

    const expiredBitset = this._candidateScoreExpired[posId]
    if (expiredBitset > 0) {
      const { NEXT_MOVER_BUFFER, context, _candidateScoreDirMap, _stateScoreDirMap } = this

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
      this._candidateScores[0][posId] = deltaScore0 * NEXT_MOVER_BUFFER + deltaScore1
      this._candidateScores[1][posId] = deltaScore0 + deltaScore1 * NEXT_MOVER_BUFFER
      this._candidateScoreExpired[posId] = 0
    }
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
              const baseScore: number = gap[normalizedCnt][isFreeSide0 + isFreeSide2]
              if (baseScore > 0) score += baseScore + Math.min(leftPossibleCnt, rightPossibleCnt)
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
            const baseScore: number = con[normalizedCnt][isFreeSide0 + isFreeSide2]
            if (baseScore > 0) score += baseScore + Math.min(leftPossibleCnt, rightPossibleCnt)
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
