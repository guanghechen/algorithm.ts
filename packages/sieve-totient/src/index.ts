/**
 *
 * @param N
 * @returns
 * @see https://me.guanghechen.com/post/math/number-theory/sieve/#heading-%E7%BA%BF%E6%80%A7%E7%AD%9B-2
 */
export function sieveTotient(N: number): [totient: Uint32Array, primes: number[]] {
  if (N < 1) return [new Uint32Array(0), []]
  if (N === 1) return [new Uint32Array(1), []]

  let tot = 0
  const totients: Uint32Array = new Uint32Array(N)
  const primes: number[] = []

  totients[1] = 1
  for (let x = 2; x < N; ++x) {
    if (totients[x] === 0) {
      // eslint-disable-next-line no-plusplus
      primes[tot++] = x
      totients[x] = x - 1
    }

    for (let i = 0; i < tot; ++i) {
      const target = primes[i] * x
      if (target >= N) break

      // Ensure that each number is only marked by its smallest positive factor.
      if (x % primes[i] === 0) {
        totients[target] = totients[x] * primes[i]
        break
      }

      totients[target] = totients[x] * (primes[i] - 1)
    }
  }

  primes.length = tot
  return [totients, primes]
}

export default sieveTotient
