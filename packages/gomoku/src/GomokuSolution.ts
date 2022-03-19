import { GomokuContext } from './GomokuContext'
import { GomokuState } from './GomokuState'
import type { IGomokuCandidateState, IGomokuPiece, IScoreMap } from './types'
import { createScoreMap } from './util'

export class GomokuSolution {
  protected readonly MAX_DEPTH: number
  protected readonly context: GomokuContext
  protected readonly state: GomokuState
  protected currentPlayer: number
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
    const _scoreMap: IScoreMap =
      scoreMap ?? createScoreMap(context.MAX_INLINE, context.MAX_POSSIBLE_INLINE)

    this.MAX_DEPTH = MAX_DEPTH
    this.context = context
    this.state = new GomokuState(context, _scoreMap)
    this.currentPlayer = -1
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
    this.currentPlayer = currentPlayer
    this.alphaBeta(
      currentPlayer,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      this.state.score(currentPlayer),
      1,
    )
    return { r: this.bestR, c: this.bestC }
  }

  protected alphaBeta(
    player: number,
    alpha: number,
    beta: number,
    stateScore: number,
    cur: number,
  ): number {
    const { state, currentPlayer } = this
    if (cur > this.MAX_DEPTH || state.isFinal()) return stateScore

    const candidates: IGomokuCandidateState[] = state.expand(player)

    if (player === currentPlayer) {
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

      if (player === currentPlayer) {
        if (alpha < gamma) {
          // eslint-disable-next-line no-param-reassign
          alpha = gamma
          if (cur === 1) {
            this.bestR = r
            this.bestC = c
          }
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        if (beta > gamma) beta = gamma
      }
      if (beta <= alpha) break
    }

    return player === currentPlayer ? alpha : beta
  }
}
