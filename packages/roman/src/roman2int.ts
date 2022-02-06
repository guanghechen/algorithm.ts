/**
 * [
 *  { arabic: 1000, roman: 'M' },
 *  { arabic: 500, roman: 'D' },
 *  { arabic: 100, roman: 'C' },
 *  { arabic: 50, roman: 'L' },
 *  { arabic: 10, roman: 'X' },
 *  { arabic: 5, roman: 'V' },
 *  { arabic: 1, roman: 'I' },
 * ]
 */
export const defaultRomanCodeMap = {
  M: 1000,
  D: 500,
  C: 100,
  L: 50,
  X: 10,
  V: 5,
  I: 1,
}

/**
 * Convert an Arabic numeral into a Roman numeral representation.
 *
 * @param roman
 * @param romanCodes
 */
export function roman2int(
  roman: string,
  romanCodeMap: Record<string, number> = defaultRomanCodeMap,
): number {
  const N = roman.length
  let value = 0
  for (let i = 0; i < N; ++i) {
    const u: number | undefined = romanCodeMap[roman[i]]
    if (u === undefined) {
      throw new TypeError(`Invalid roman number: (${roman})`)
    }

    if (i + 1 < N && u < romanCodeMap[roman[i + 1]]) value -= u
    else value += u
  }
  return value
}
