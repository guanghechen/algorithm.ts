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

export default sievePrime
