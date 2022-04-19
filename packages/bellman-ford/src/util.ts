/**
 * List all points on the shortest path from source to target in order.
 *
 * @param bestFrom
 * @param source
 * @param target
 * @returns
 */
export const getShortestPath = (
  bestFrom: ReadonlyArray<number>,
  source: number,
  target: number,
): number[] => {
  const path: number[] = [target]
  for (let x = target, parent: number; x !== source; x = parent) {
    parent = bestFrom[x]
    path.push(parent)
  }
  return path.reverse()
}
