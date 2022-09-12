/**
 *
 * @param N
 * @returns
 * @see https://me.guanghechen.com/post/math/number-theory/sieve/#heading-%E7%BA%BF%E6%80%A7%E7%AD%9B
 */
export function sievePrime(N: number): number[] {
  if (N <= 1) return []

  let tot = 0
  const primes: number[] = []
  const isNotPrime: Uint8Array = new Uint8Array(N)

  for (let x = 2; x < N; ++x) {
    // eslint-disable-next-line no-plusplus
    if (!isNotPrime[x]) primes[tot++] = x
    for (let i = 0; i < tot; ++i) {
      if (primes[i] * x >= N) break

      isNotPrime[primes[i] * x] = 1

      // Ensure that each number is only marked by its smallest positive factor.
      if (x % primes[i] === 0) break
    }
  }

  primes.length = tot
  return primes
}

/**
 *
 * @param N
 * @returns
 * @see https://me.guanghechen.com/post/math/number-theory/sieve/#heading-%E7%BA%BF%E6%80%A7%E7%AD%9B-2
 */
export function sieveTotient(N: number): [totients: number[], primes: number[]] {
  if (N < 1) return [[], []]
  if (N === 1) return [[0], []]

  let tot = 0
  const phi: number[] = new Array(N).fill(0)
  const primes: number[] = []

  phi[1] = 1
  for (let x = 2; x < N; ++x) {
    if (phi[x] === 0) {
      // eslint-disable-next-line no-plusplus
      primes[tot++] = x
      phi[x] = x - 1
    }

    for (let i = 0; i < tot; ++i) {
      const e = primes[i]
      const target = e * x
      if (target >= N) break

      // Ensure that each number is only marked by its smallest positive factor.
      if (x % e === 0) {
        phi[target] = phi[x] * e
        break
      }

      phi[target] = phi[x] * (e - 1)
    }
  }

  primes.length = tot
  return [phi, primes]
}
