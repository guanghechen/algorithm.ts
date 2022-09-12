import type { IHeuristicFindset } from './types'
import { UnsafeHeuristicFindset } from './unsafe/heuristic'

export class HeuristicFindset extends UnsafeHeuristicFindset implements IHeuristicFindset {
  public override init(N: number): void {
    if (!Number.isInteger(N) || N < 1) {
      throw new RangeError(
        `[HeuristicFindset] N is expected to be a positive integer, but got (${N}).`,
      )
    }
    super.init(N)
  }

  public override root(x: number): number {
    if (!Number.isInteger(x) || x < 1 || x > this._N) {
      throw new RangeError(
        `[HeuristicFindset] x is expected to be a positive integer smaller than ${this._N}, but got (${x}).`,
      )
    }
    return super.root(x)
  }
}
