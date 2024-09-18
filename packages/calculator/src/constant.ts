export enum TokenSymbol {
  DIGIT = 1,
  OPEN_PAREN = 2,
  CLOSE_PAREN = 3,
  PLUS = 4,
  MINUS = 5,
  MULTI = 6,
  DIVIDE = 7,
  END = 8,
  A = -1,
  B = -2,
  C = -3,
  D = -4,
  E = -5,
}

/**
 * Priority map.
 */
export const ll1IdxMap: Readonly<Record<string, TokenSymbol>> = Object.freeze({
  '0': TokenSymbol.DIGIT,
  '1': TokenSymbol.DIGIT,
  '2': TokenSymbol.DIGIT,
  '3': TokenSymbol.DIGIT,
  '4': TokenSymbol.DIGIT,
  '5': TokenSymbol.DIGIT,
  '6': TokenSymbol.DIGIT,
  '7': TokenSymbol.DIGIT,
  '8': TokenSymbol.DIGIT,
  '9': TokenSymbol.DIGIT,
  '(': TokenSymbol.OPEN_PAREN,
  ')': TokenSymbol.CLOSE_PAREN,
  '+': TokenSymbol.PLUS,
  '-': TokenSymbol.MINUS,
  '*': TokenSymbol.MULTI,
  '/': TokenSymbol.DIVIDE,
  $: TokenSymbol.END,
  A: TokenSymbol.A,
  B: TokenSymbol.B,
  C: TokenSymbol.C,
  D: TokenSymbol.D,
  E: TokenSymbol.E,
})

export const idx = (c: string): number => ll1IdxMap[c]

export const sddTable: number[][] = [
  'BD', //    0: A --> BD
  '+BD', //   1: A --> +BD
  '-BD', //   2: A --> -BD
  'CE', //    3: B --> CE
  '0', //     4: C --> digit
  '(A)', //   5: C --> (A)
  '+BD', //   6: D --> +BD
  '-BD', //   7: D --> -BD
  '', //      8: D --> \varepsilon
  '*CE', //   9: E --> *CE
  '/CE', //  10: E --> /CE
  '', //     11: E --> \varepsilon
].map(x => x.split('').map(idx))

// tokens: A,B,C,D,E
export const MAX_TOKENS = 5

// symbols: digit, (, ), +, -, *, /, $
export const MAX_SYMBOLS = 8

// LL1 table.
export const ll1Table: Int8Array[] = new Array(MAX_TOKENS + 1)

// Initialize LL1Table
// eslint-disable-next-line no-lone-blocks
{
  for (let i = 0; i <= MAX_TOKENS; ++i) {
    ll1Table[i] = new Int8Array(MAX_SYMBOLS + 1).fill(-1)
  }

  // 0: A -> BD
  ll1Table[1][1] = 0
  ll1Table[1][2] = 0

  // 1: A -> +BD
  ll1Table[1][4] = 1

  // 2: A -> -BD
  ll1Table[1][5] = 2

  // 3: B --> CE
  ll1Table[2][1] = 3
  ll1Table[2][2] = 3

  // 4: C --> digit
  ll1Table[3][1] = 4

  // 5: C --> (A)
  ll1Table[3][2] = 5

  // 6: D --> +BD
  ll1Table[4][4] = 6

  // 7: D --> -BD
  ll1Table[4][5] = 7

  // 8: D --> \varepsilon
  ll1Table[4][3] = 8
  ll1Table[4][8] = 8

  // 9: E --> *CE
  ll1Table[5][6] = 9

  // 10: E --> /CE
  ll1Table[5][7] = 10

  // 11: E --> \varepsilon
  ll1Table[5][3] = 11
  ll1Table[5][4] = 11
  ll1Table[5][5] = 11
  ll1Table[5][8] = 11
}
