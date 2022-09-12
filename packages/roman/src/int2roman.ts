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
export const defaultRomanCodes = 'MDCLXVI'

/**
 * Convert an Arabic numeral into a Roman numeral representation.
 *
 * @param originalValue
 * @param romanCodes
 * @returns
 */
export function int2roman(originalValue: number, romanCodes: string = defaultRomanCodes): string {
  let one = 10 ** Math.floor(romanCodes.length / 2)
  const MAX_VALUE = romanCodes.length & 1 ? one * 4 : one * 9

  let value: number = Math.floor(originalValue)
  if (value <= 0 || value >= MAX_VALUE) {
    throw new TypeError(`Out of range [1, ${MAX_VALUE}).`)
  }

  let i = romanCodes.length & 1 ? 0 : 1
  const roman: string[] = []

  // Convert high-order numbers
  if (i === 0) convert('', '', romanCodes[0])
  else convert('', romanCodes[0], romanCodes[1])

  // Covert remain numbers
  for (one /= 10; one > 0; one /= 10, i += 2) {
    convert(romanCodes[i], romanCodes[i + 1], romanCodes[i + 2])
  }
  return roman.join('')

  function convert(r10: string, r5: string, r1: string): void {
    const four: number = one << 2
    const five: number = one + four
    const nine: number = four + five

    // Nine
    if (value >= nine) {
      value -= nine
      roman.push(r1, r10)
      return
    }

    if (value >= five) {
      value -= five
      roman.push(r5)
      for (; value >= one; value -= one) roman.push(r1)
      return
    }

    // Four
    if (value >= four) {
      value -= four
      roman.push(r1, r5)
      return
    }

    for (; value >= one; value -= one) roman.push(r1)
    return
  }
}
