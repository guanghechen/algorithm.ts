/**
 * Find a least lexicographical match for the longest common subsequence.
 */
export function lcs_size_myers(
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
): number {
  if (N1 <= 0 || N2 <= 0) return 0

  let x0 = 0
  for (let y0: number = 0; x0 < N1 && y0 < N2 && equals(x0, y0); ++x0, ++y0);
  if (x0 === N1 || x0 === N2) return N1 < N2 ? N1 : N2

  const K: number = N1 - N2
  const L: number = N1 + N2 + 1
  const diagonals: number[] = new Array(L)
  diagonals[0] = x0

  for (let step = 1; ; ++step) {
    const parity: 0 | 1 = (step & 1) as 0 | 1
    const kl: number = -(step < N2 ? step : N2)
    const kr: number = step < N1 ? step : N1

    if (step <= N2) {
      let x: number = 0
      for (let y: number = step; x < N1 && y < N2 && equals(x, y); ++x, ++y);
      const k: number = -step
      diagonals[k + L] = x
    }

    if (step <= N1) {
      let x: number = step
      for (let y: number = 0; x < N1 && y < N2 && equals(x, y); ++x, ++y);
      const k: number = step
      diagonals[k] = x
    }

    for (let k = -parity; k >= kl; k -= 2) {
      const x: number = forward(kl, kr, k)
      if (x === N1 && k === K) return (N1 + N2 - step) / 2
    }

    for (let k = parity; k <= kr; k += 2) {
      const x: number = forward(kl, kr, k)
      if (x === N1 && k === K) return (N1 + N2 - step) / 2
    }
  }

  function forward(kl: number, kr: number, k: number): number {
    const kid: number = k < 0 ? k + L : k
    let x: number = diagonals[kid]
    if (x < N1) {
      if (k > kl) {
        const kl: number = k - 1
        const xl: number = diagonals[kl < 0 ? kl + L : kl]
        if (x <= xl && xl < N1) x = xl + 1
      }

      if (k < kr) {
        const kr: number = k + 1
        const xr: number = diagonals[kr < 0 ? kr + L : kr]
        if (x < xr) x = xr
      }

      for (let y: number = x - k; x < N1 && y < N2 && equals(x, y); ++x, ++y);
      diagonals[kid] = x
    }
    return x
  }
}
