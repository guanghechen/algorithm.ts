import { GomokuContext } from './GomokuContext'
import { GomokuState } from './GomokuState'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'
import { createScoreMap } from './util'

export class GomokuSolution {
  protected readonly MAX_DEPTH: number
  protected readonly context: GomokuContext
  protected readonly state: GomokuState
  protected scoreForPlayer: number
  protected bestR: number
  protected bestC: number

  constructor(
    MAX_ROW: number,
    MAX_COL: number,
    MAX_INLINE = 5,
    MAX_DEPTH = 3,
    scoreMap?: IScoreMap,
  ) {
    const context = new GomokuContext(MAX_ROW, MAX_COL, MAX_INLINE)
    const _scoreMap: IScoreMap = scoreMap ?? createScoreMap(context.MAX_INLINE)

    this.MAX_DEPTH = MAX_DEPTH
    this.context = context
    this.state = new GomokuState(context, _scoreMap)
    this.scoreForPlayer = -1
    this.bestR = -1
    this.bestC = -1
  }

  public init(pieces: ReadonlyArray<IGomokuPiece>): void {
    this.state.init(pieces)
  }

  public move(r: number, c: number, p: number): void {
    this.state.forward(r, c, p)
  }

  public minmaxMatch(currentPlayer: number): { r: number; c: number } {
    if (this.state.isFinal()) return { r: -1, c: -1 }

    this.scoreForPlayer = currentPlayer
    this.bestR = this.bestC = -1
    this.alphaBeta(currentPlayer, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 0, 1)
    const { bestR: r, bestC: c } = this
    return r < 0 || c < 0 ? this.state.randomMove() : { r, c }
  }

  protected alphaBeta(
    player: number,
    alpha: number,
    beta: number,
    stateScore: number,
    cur: number,
  ): number {
    const { state, scoreForPlayer } = this
    if (cur > this.MAX_DEPTH || state.isFinal()) return stateScore

    const candidates: IGomokuCandidateState[] = state.expand(player, scoreForPlayer)
    if (candidates.length <= 0) return stateScore

    if (player === scoreForPlayer) {
      // Higher score items common first.
      candidates.sort((x, y) => y.score - x.score)
    } else {
      // Lower score items common first.
      candidates.sort((x, y) => x.score - y.score)
    }

    for (const { r, c, score } of candidates) {
      state.forward(r, c, player)
      const gamma: number = this.alphaBeta(player ^ 1, alpha, beta, score, cur + 1)
      state.rollback(r, c)

      if (cur === 1) {
        if (alpha < gamma) {
          this.bestR = r
          this.bestC = c
        }
      }

      if (player === scoreForPlayer) {
        // eslint-disable-next-line no-param-reassign
        if (alpha < gamma) alpha = gamma
      } else {
        // eslint-disable-next-line no-param-reassign
        if (beta > gamma) beta = gamma
      }
      if (beta <= alpha) break
    }

    return player === scoreForPlayer ? alpha : beta
  }
}
