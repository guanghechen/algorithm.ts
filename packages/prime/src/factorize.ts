export interface IPrimeFactor {
  factor: number
  exponential: number
}

/**
 * Calc all prime factors of number n.
 * @param n
 * @param primes
 * @returns
 */
export function* factorize(n: number, primes: ReadonlyArray<number>): Iterable<IPrimeFactor> {
  if (n <= 1) return []

  let x = n
  for (const e of primes) {
    if (e * e > x) break
    if (x % e === 0) {
      let exponential = 1
      for (x /= e; x % e === 0; exponential += 1) x /= e
      yield { factor: e, exponential }
    }
  }
  if (x > 1) yield { factor: x, exponential: 1 }
}
