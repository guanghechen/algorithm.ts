import { gomokuDirectionTypes, leftHalfGomokuDirectionTypes } from './constant'
import type { GomokuDirectionType } from './constant'
import type { IGomokuContext } from './context.type'
import type { IGomokuState } from './state.type'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'

type ICountOfReachLimits = [count0: number, count1: number]
type ICountOfReachLimitsDirMap = number[][][] // [playerId][dirType][startPosId]
type IStateScores = [score0: number, score1: number]
type IStateScoresDirMap = number[][][] // [playerId][dirType][startPosId]
type ICandidateScore = [s00: number, s01: number, s10: number, s11: number]
type ICandidateMap = Map<number, ICandidateScore>

export interface IGomokuStateProps {
  mainPlayerId: number
  context: IGomokuContext
  scoreMap: IScoreMap
  MAX_NEXT_MOVER_BUFFER: number
}

export class GomokuState implements IGomokuState {
  public readonly MAX_NEXT_MOVER_BUFFER: number
  public readonly context: IGomokuContext
  protected readonly _mainPlayerId: number
  protected readonly _scoreMap: IScoreMap
  protected readonly _countOfReachLimits: ICountOfReachLimits
  protected readonly _countOfReachLimitsDirMap: ICountOfReachLimitsDirMap
  protected readonly _stateScores: IStateScores
  protected readonly _stateScoresDirMap: IStateScoresDirMap
  protected readonly _candidateMap: ICandidateMap
  protected _nextMoverBuffer: number

  constructor(props: IGomokuStateProps) {
    const { mainPlayerId, context, scoreMap, MAX_NEXT_MOVER_BUFFER } = props
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
    this._mainPlayerId = mainPlayerId
    this._scoreMap = scoreMap
    this._countOfReachLimits = [0, 0]
    this._countOfReachLimitsDirMap = _countOfReachLimitsDirMap
    this._stateScores = [0, 0]
    this._stateScoresDirMap = _dirStateScoreMap
    this._candidateMap = new Map()
    this._nextMoverBuffer = 0
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    const {
      context,
      _countOfReachLimits,
      _countOfReachLimitsDirMap,
      _stateScores,
      _stateScoresDirMap,
      _candidateMap,
    } = this

    _countOfReachLimits.fill(0)
    _stateScores.fill(0)
    for (const dirType of leftHalfGomokuDirectionTypes) {
      _countOfReachLimitsDirMap[0][dirType].fill(0)
      _countOfReachLimitsDirMap[1][dirType].fill(0)
      _stateScoresDirMap[0][dirType].fill(0)
      _stateScoresDirMap[1][dirType].fill(0)

      for (const startPosId of context.getStartPosSet(dirType)) {
        const { scores, countOfReachLimits } = this._calcScoreForSpecialDirection(
          startPosId,
          dirType,
        )

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
    _candidateMap.clear()
    for (const { r, c } of pieces) {
      const posId: number = context.idx(r, c)
      for (const [posId2] of context.accessibleNeighbors(posId)) {
        if (context.board[posId2] < 0 && !_candidateMap.has(posId2)) {
          const score = this._evaluateCandidate(posId2)
          _candidateMap.set(posId2, score)
        }
      }
    }
  }

  public forward(posId: number): void {
    const { context, _candidateMap } = this
    this._updateStateScore(posId)
    _candidateMap.delete(posId)
    for (const [posId2] of context.accessibleNeighbors(posId)) {
      if (context.board[posId2] < 0 && !_candidateMap.has(posId2)) {
        _candidateMap.set(posId2, this._evaluateCandidate(posId2))
      }
    }
    this._reEvaluateCandidates(posId)
  }

  public revert(posId: number): void {
    const { context, _candidateMap } = this
    this._updateStateScore(posId)
    if (context.hasPlacedNeighbors(posId)) _candidateMap.set(posId, this._evaluateCandidate(posId))
    for (const [id2] of context.accessibleNeighbors(posId)) {
      if (context.board[id2] >= 0 || !context.hasPlacedNeighbors(id2)) {
        _candidateMap.delete(id2)
      }
    }
    this._reEvaluateCandidates(posId)
  }

  public expand(nextPlayer: number, candidates: IGomokuCandidateState[]): number {
    const scoreForPlayer: number = this._mainPlayerId
    const nextMoverFac: number = 1 + this._nextMoverBuffer
    let i = 0
    const player0: number = (nextPlayer << 1) | scoreForPlayer
    const player1: number = player0 ^ 1

    if (!this._candidateMap.has(this.context.MIDDLE_POS)) {
      const score: ICandidateScore = this._evaluateCandidate(this.context.MIDDLE_POS)
      this._candidateMap.set(this.context.MIDDLE_POS, score)
    }

    for (const [posId, scores] of this._candidateMap) {
      const score0: number = scores[player0]
      const score1: number = scores[player1]
      const score: number =
        nextPlayer === scoreForPlayer
          ? score0 - score1 * nextMoverFac
          : score0 * nextMoverFac - score1
      // eslint-disable-next-line no-param-reassign
      candidates[i] = { id: posId, score }
      i += 1
    }
    return i
  }

  public score(currentPlayer: number): number {
    const scoreForPlayer: number = this._mainPlayerId
    const nextMoverFac: number = 1 + this._nextMoverBuffer
    const score0: number = this._stateScores[scoreForPlayer]
    const score1: number = this._stateScores[scoreForPlayer ^ 1]
    return currentPlayer === scoreForPlayer
      ? score0 - score1 * nextMoverFac
      : score0 * nextMoverFac - score1
  }

  public reRandNextMoverBuffer(): void {
    this._nextMoverBuffer = Math.random() * this.MAX_NEXT_MOVER_BUFFER
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
      } = this._calcScoreForSpecialDirection(startPosId, dirType)
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

  protected _reEvaluateCandidates(centerPosId: number): void {
    const { context, _candidateMap } = this
    if (_candidateMap.has(centerPosId)) {
      const score = _candidateMap.get(centerPosId)!
      this._evaluateCandidate(centerPosId, score)
    }

    const THRESHOLD: number = context.MAX_ADJACENT * 2 - 3
    for (const dirType of gomokuDirectionTypes) {
      let posId: number = centerPosId
      const maxStep: number = Math.min(THRESHOLD, context.maxMovableSteps(posId, dirType))
      for (let step = 0; step < maxStep; ++step) {
        posId = context.fastMoveOneStep(posId, dirType)
        const score = _candidateMap.get(posId)
        if (score) this._evaluateCandidate(posId, score)
      }
    }
  }

  protected _evaluateCandidate(posId: number, score?: ICandidateScore): ICandidateScore {
    const { context } = this
    let score00 = 0
    let score01 = 0
    let score10 = 0
    let score11 = 0

    context.forward(posId, 0)
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const {
        scores: [score0, score1],
      } = this._calcScoreForSpecialDirection(startPosId, dirType)
      score00 += score0
      score01 += score1
    }
    context.revert(posId)

    context.forward(posId, 1)
    for (const dirType of leftHalfGomokuDirectionTypes) {
      const startPosId: number = context.getStartPosId(posId, dirType)
      const {
        scores: [score0, score1],
      } = this._calcScoreForSpecialDirection(startPosId, dirType)
      score10 += score0
      score11 += score1
    }
    context.revert(posId)

    const _score: ICandidateScore = score ?? ([] as unknown as ICandidateScore)
    _score[0] = score00
    _score[1] = score01
    _score[2] = score10
    _score[3] = score11
    return _score
  }

  protected _calcScoreForSpecialDirection(
    startPosId: number,
    dirType: GomokuDirectionType,
  ): { scores: IStateScores; countOfReachLimits: ICountOfReachLimits } {
    const {
      context,
      _scoreMap: { con, gap },
    } = this
    const { MAX_ADJACENT, board } = context
    const THRESHOLD: number = MAX_ADJACENT - 1

    const maxSteps: number = context.maxMovableSteps(startPosId, dirType) + 1
    const counters: Array<[playerId: number, count: number]> = []
    for (
      let i = 0, posId = startPosId, i2: number, posId2: number;
      i < maxSteps;
      i = i2, posId = posId2
    ) {
      const playerId: number = board[posId]
      for (i2 = i + 1, posId2 = posId; i2 < maxSteps; ++i2) {
        posId2 = context.fastMoveOneStep(posId2, dirType)
        if (board[posId2] !== playerId) break
      }
      counters.push([playerId, i2 - i])
    }

    const scores: IStateScores = [0, 0]
    const countOfReachLimits: ICountOfReachLimits = [0, 0]

    const _size = counters.length
    for (let i = 0, j: number, k: number; i < _size; i = j) {
      if (i > 0 && counters[i - 1][0] < 0) i -= 1
      k = i
      j = i

      let [playerId, maxPossibleCnt] = counters[j]
      if (playerId < 0) {
        // eslint-disable-next-line no-plusplus
        if (++j === _size) break
        const [playerId2, cnt] = counters[j]
        playerId = playerId2
        maxPossibleCnt += cnt
        k += 1
      }

      for (j += 1; j < _size; ++j) {
        const [playerId2, cnt] = counters[j]
        if (playerId2 >= 0 && playerId2 !== playerId) break
        maxPossibleCnt += cnt
      }

      if (maxPossibleCnt >= MAX_ADJACENT) {
        let isFreeSide0: 0 | 1 = k > i ? 1 : 0
        for (let usedK = -1; k < j; k += 2, isFreeSide0 = 1) {
          const cnt1: number = counters[k][1]
          if (cnt1 < THRESHOLD && k + 2 < j && counters[k + 1][1] === 1) {
            const cnt2: number = counters[k + 2][1]
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
