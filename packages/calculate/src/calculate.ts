import { TokenSymbol, idx, ll1Table, sddTable } from './constant'

export function parseInteger(s: string, start: number): [number, number] {
  let result = 0
  let i: number = start
  for (; i < s.length; ++i) {
    const c = s[i]
    if (!/\d/.test(c)) break
    result = result * 10 + Number(c)
  }
  return [i, result]
}

export function calculate(
  rawExpression: string,
  parseNumber: (
    s: string,
    start: number,
  ) => [nextIndex: number, value: number] = parseInteger,
): number {
  const expression = rawExpression.replace(/[\s]+/g, '')
  let cur = 0
  const result: number = dfs(idx('A'), 0, 0)
  return cur === expression.length ? result : Number.NaN

  function dfs(id: number, syn: number, inh: number): number {
    if (cur === expression.length) {
      // Only D and E could be parsed as \varepsilon
      if (id === TokenSymbol.D || id === TokenSymbol.E) return inh
      return Number.NaN
    }

    const id0 = idx(expression[cur])

    // Unrecognized symbol.
    if (id0 === undefined) return Number.NaN

    // Matched an operator.
    if (id === id0) {
      // Matched digits.
      if (id0 === TokenSymbol.DIGIT) {
        const [nextCur, value] = parseNumber(expression, cur)

        // No valid digit found.
        if (cur === nextCur) return Number.NaN

        cur = nextCur
        return value
      }

      cur += 1
      return syn
    }

    // Syntax error.
    if (id > 0) return Number.NaN

    const ssdId = ll1Table[-id][id0]
    if (ssdId < 0) return Number.NaN

    const tokens: ReadonlyArray<number> = sddTable[ssdId]
    const syn0: number = tokens.length > 0 ? dfs(tokens[0], 0, 0) : 0
    if (Number.isNaN(syn0)) return Number.NaN

    switch (ssdId) {
      // 0: A --> BD
      case 0:
        return dfs(tokens[1], 0, syn0)

      // 1: A --> +BD
      case 1: {
        const val1: number = dfs(tokens[1], 0, 0)
        return dfs(tokens[2], 0, val1)
      }

      // 2: A --> -BD
      case 2: {
        const val1: number = dfs(tokens[1], 0, 0)
        return dfs(tokens[2], 0, -val1)
      }

      // 3: B --> CE
      case 3:
        return dfs(tokens[1], 0, syn0)

      // 4: C --> digit
      case 4:
        return syn0

      // 5: C --> (A)
      case 5: {
        const result: number = dfs(tokens[1], 0, 0)
        const result2: number = dfs(tokens[2], 0, 0)
        return Number.isNaN(result2) ? Number.NaN : result
      }

      // 6: D --> +BD
      case 6: {
        const val1: number = dfs(tokens[1], 0, 0)
        return dfs(tokens[2], 0, inh + val1)
      }

      // 7: D --> -BD
      case 7: {
        const val1: number = dfs(tokens[1], 0, 0)
        return dfs(tokens[2], 0, inh - val1)
      }

      // 8: D --> \varepsilon
      case 8:
        return inh

      // 9: E --> *CE
      case 9: {
        const val1: number = dfs(tokens[1], 0, 0)
        return dfs(tokens[2], 0, inh * val1)
      }

      // 10: E --> /CE
      case 10: {
        const val1: number = dfs(tokens[1], 0, 0)
        return dfs(tokens[2], 0, inh / val1)
      }

      // 11: E --> \varepsilon
      case 11:
        return inh

      // Here is not reachable.
      default:
        return Number.NaN
    }
  }
}
