import type { IFindset } from './types'
import { UnsafeVanillaFindset } from './unsafe/vanilla'

/**
 * Vanilla Findset, no heuristic operations, no fancy features.
 */
export class VanillaFindset extends UnsafeVanillaFindset implements IFindset {
  public override init(N: number): void {
    if (!Number.isInteger(N) || N < 1) {
      throw new RangeError(
        `[VanillaFindset] N is expected to be a positive integer, but got (${N}).`,
      )
    }
    super.init(N)
  }

  public override root(x: number): number {
    if (!Number.isInteger(x) || x < 1 || x > this._N) {
      throw new RangeError(
        `[VanillaFindset] x is expected to be a positive integer smaller than ${this._N}, but got (${x}).`,
      )
    }
    return super.root(x)
  }
}
