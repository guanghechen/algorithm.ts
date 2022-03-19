export interface IGomokuPiece {
  r: number // row number
  c: number // column number
  p: number // player: should be positive integer.
}

export interface IGomokuCandidateState {
  r: number // row number
  c: number // column number
  score: number // score for the state when placing a piece on r-th row and c-th column.
}

export type IShapeCount = [
  noSideAvailable: number,
  oneSideAvailable: number,
  twoSideAvailable: number,
]

export interface IScoreMap {
  continuously: IShapeCount[]
  gap: IShapeCount[]
}
