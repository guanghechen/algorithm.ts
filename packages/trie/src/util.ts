import {
  CODEPOINT_DIGIT_0,
  CODEPOINT_DIGIT_9,
  CODEPOINT_LOWER_A,
  CODEPOINT_UPPER_A,
  CODEPOINT_UPPER_Z,
} from '@algorithm.ts/_constant'

// Calc idx of digit character.
export const digitIdx = (c: string): number => c.codePointAt(0)! - CODEPOINT_DIGIT_0

// Calc idx of uppercase English letter.
export const uppercaseIdx = (c: string): number => c.codePointAt(0)! - CODEPOINT_UPPER_A

// Calc idx of lowercase English letter.
export const lowercaseIdx = (c: string): number => c.codePointAt(0)! - CODEPOINT_LOWER_A

/**
 * Please ensure the input character is digit or english letter.
 * @param c
 * @returns
 */
export const alphaNumericIdx = (c: string): number => {
  const t = c.codePointAt(0)!
  if (t <= CODEPOINT_DIGIT_9) return t - CODEPOINT_DIGIT_0 // digits
  if (t <= CODEPOINT_UPPER_Z) return t - CODEPOINT_UPPER_A + 10 // uppercase letters
  return t - CODEPOINT_LOWER_A + 36
}
