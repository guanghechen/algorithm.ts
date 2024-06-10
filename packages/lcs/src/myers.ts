/**
 * Find a least lexicographical match for the longest common subsequence.
 */
export function myers(
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
): Array<[number, number]> {
  if (N1 <= 0 || N2 <= 0) return []

  let x0 = 0
  for (let y0: number = 0; x0 < N1 && y0 < N2 && equals(x0, y0); ++x0, ++y0);

  if (x0 === N1 || x0 === N2) {
    const answers: Array<[number, number]> = []
    for (let i = 0; i < x0; ++i) answers.push([i, i])
    return answers
  }

  const L: number = N1 + N2 + 1
  const diagonals: number[] = new Array(L)
  diagonals[0] = x0

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

      if (step <= N2) {
        const k: number = -step
        let x: number = 0
        for (let y: number = x - k; x < N1 && y < N2 && equals(x, y); ++x, ++y);
        diagonals[k + L] = x
      }

      if (step <= N1) {
        const k: number = step
        let x: number = step
        for (let y: number = x - k; x < N1 && y < N2 && equals(x, y); ++x, ++y);
        diagonals[k] = x
      }

      for (let k = -parity; k >= kl; k -= 2) {
        const x: number = forward(kl, kr, k)
        if (x === N1 && x - k === N2) return step
      }

      for (let k = parity; k <= kr; k += 2) {
        const x: number = forward(kl, kr, k)
        if (x === N1 && x - k === N2) return step
      }
    }
  }

  function forward(kl: number, kr: number, k: number): number {
    const kid: number = k < 0 ? k + L : k
    let x: number = diagonals[kid]
    if (x < N1) {
      if (k > kl) {
        const kl: number = k - 1
        const xl: number = diagonals[kl < 0 ? kl + L : kl]
        if (x <= xl && xl < N1) {
          const p: number = position(k - 1, xl)
          parents.set(p, -1)
          x = xl + 1
        }
      }

      if (k < kr) {
        const kr: number = k + 1
        const xr: number = diagonals[kr < 0 ? kr + L : kr]
        if (x < xr) {
          const p: number = position(k + 1, xr)
          parents.set(p, 1)
          x = xr
        }
      }

      for (let y: number = x - k; x < N1 && y < N2 && equals(x, y); ++x, ++y);
      diagonals[kid] = x
    }
    return x
  }

  function position(k: number, x: number): number {
    const y: number = x - k
    return y * N1 + x
  }
}
