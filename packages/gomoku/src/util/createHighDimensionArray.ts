/**
 * Create high dimension array, eg: createHighDimensionArray(-1, 3, 4, 2) =>
 *
 *      [
 *        [
 *          [-1, -1],
 *          [-1, -1],
 *          [-1, -1],
 *          [-1, -1],
 *        ],
 *        [
 *          [-1, -1],
 *          [-1, -1],
 *          [-1, -1],
 *          [-1, -1],
 *        ],
 *        [
 *          [-1, -1],
 *          [-1, -1],
 *          [-1, -1],
 *          [-1, -1],
 *        ]
 *      ]
 *
 * @param elementProvider
 * @param firstDimension
 * @param dimensions
 * @returns
 */
export const createHighDimensionArray = <T>(
  elementProvider: (index: number) => T,
  firstDimension: number,
  ...dimensions: number[]
): any[] => {
  const result = new Array(firstDimension)
  if (dimensions.length <= 0) {
    for (let i = 0; i < firstDimension; ++i) {
      result[i] = elementProvider(i)
    }
    return result
  }

  for (let i = 0; i < firstDimension; ++i) {
    result[i] = createHighDimensionArray(elementProvider, ...(dimensions as [number, ...number[]]))
  }
  return result
}
