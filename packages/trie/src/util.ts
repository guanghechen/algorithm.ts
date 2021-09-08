// Calc idx of lowercase English letter.
export const lowercaseIdx = (c: string): number => c.codePointAt(0)! - 97

// Calc idx of uppercase English letter.
export const uppercaseIdx = (c: string): number => c.codePointAt(0)! - 65

// Calc idx of digit character.
export const digitIdx = (c: string): number => c.codePointAt(0)! - 48
