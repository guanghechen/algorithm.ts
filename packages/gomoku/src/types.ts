export interface IGomokuPiece {
  r: number // row number
  c: number // column number
  p: number // player: should be positive integer.
}

export interface IGomokuCandidateState {
  $id: number // uuid
  posId: number // The value after encoding the coordinates of the piece.
  score: number // Diff score for first player
}

export type IShapeCount = [
  noSideAvailable: number,
  oneSideAvailable: number,
  twoSideAvailable: number,
]

export type IShapeCountScore = IShapeCount[]

export interface IShapeScoreMap {
  con: IShapeCountScore
  gap: IShapeCountScore
}

export type IGomokuBoard = number[]

export interface IDirCounter {
  playerId: number
  count: number
}
