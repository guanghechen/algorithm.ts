/**
 * Find a least lexicographical match for the longest common subsequence.
 */
export function lcs_myers(
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
): Array<[number, number]> {
  if (N1 <= 0 || N2 <= 0) return []

  const fx0: number = fast_forward(0, 0)
  if (fx0 === N1 || fx0 === N2) {
    const answers: Array<[number, number]> = new Array(fx0)
    for (let i = 0; i < fx0; ++i) answers[i] = [i, i]
    return answers
  }

  const K: number = N1 - N2
  const L: number = N1 + N2 + 1
  const diagonals: number[] = new Array(L)
  diagonals[0] = fx0

  const parents: Map<number, -1 | 1 | undefined> = new Map()
  const count: number = (N1 + N2 - lcs()) / 2
  const answers = new Array(count)
  for (let x = N1, y = N2, i = count; x > 0 && y > 0; ) {
    const dir: -1 | 1 | undefined = parents.get(y * N1 + x)
    if (dir === -1) --x
    else if (dir === 1) --y
    else answers[--i] = [--x, --y]
  }
  return answers

  function lcs(): number {
    for (let step = 1; ; ++step) {
      const parity: 0 | 1 = (step & 1) as 0 | 1
      const kl: number = -(step < N2 ? step : N2)
      const kr: number = step < N1 ? step : N1

      if (step <= N1) {
        const fk: number = step
        diagonals[fk < 0 ? fk + L : fk] = fast_forward(fk, step)
      }

      if (step <= N2) {
        const fk: number = -step
        diagonals[fk < 0 ? fk + L : fk] = fast_forward(fk, 0)
      }

      for (let k = -parity; k >= kl; k -= 2) {
        const x: number = forward(kl, kr, k)
        if (x === N1 && k === K) return step
      }

      for (let k = parity; k <= kr; k += 2) {
        const x: number = forward(kl, kr, k)
        if (x === N1 && k === K) return step
      }
    }
  }

  function fast_forward(k: number, x0: number): number {
    let x: number = x0
    for (let y: number = x - k; x < N1 && y < N2 && equals(x, y); ++x, ++y);
    return x
  }

  function forward(kl: number, kr: number, k: number): number {
    const kid: number = k < 0 ? k + L : k
    let x: number = diagonals[kid]
    if (x < N1) {
      if (k > kl) {
        const kl: number = k - 1
        const xl: number = diagonals[kl < 0 ? kl + L : kl]
        if (x <= xl && xl < N1) {
          x = xl + 1
          const p: number = (x - k) * N1 + x
          parents.set(p, -1)
        }
      }

      if (k < kr) {
        const kr: number = k + 1
        const xr: number = diagonals[kr < 0 ? kr + L : kr]
        if (x < xr) {
          x = xr
          const p: number = (x - k) * N1 + x
          parents.set(p, 1)
        }
      }

      for (let y: number = x - k; x < N1 && y < N2 && equals(x, y); ++x, ++y);
      diagonals[kid] = x
    }
    return x
  }
}
