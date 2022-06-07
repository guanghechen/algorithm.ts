import { GomokuStateCompressor } from './state-compressor'

export class GomokuStateCache {
  protected readonly MAX_STATES: number
  protected readonly stateCompressor: GomokuStateCompressor
  protected readonly states: Map<bigint, number>

  constructor(TOTAL_POS: bigint, MAX_STATES = 2e5) {
    this.stateCompressor = new GomokuStateCompressor(TOTAL_POS)
    this.states = new Map()
    this.MAX_STATES = MAX_STATES
  }

  public get INITIAL_STATE(): bigint {
    return this.stateCompressor.INITIAL_STATE
  }

  public clear(): void {
    this.states.clear()
  }

  public get(state: bigint): number | undefined {
    return this.states.get(state)
  }

  public set(state: bigint, score: number): void {
    if (this.states.size < this.MAX_STATES) this.states.set(state, score)
  }

  public calcNextState(cur: number, prevState: bigint, nextMovePosId: number): bigint {
    const nextState: bigint = this.stateCompressor.compress(cur, prevState, BigInt(nextMovePosId))
    return nextState
  }
}
