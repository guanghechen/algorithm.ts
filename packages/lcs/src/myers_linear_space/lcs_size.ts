/**
 * Find a least lexicographical match for the longest common subsequence.
 */
export function lcs_size_myers_linear_space(
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
): number {
  if (N1 <= 0 || N2 <= 0) return 0

  const L: number = N1 + N2 + 1
  const FK0: number = 0
  const BK0: number = N1 - N2

  const fx0: number = fast_forward(FK0, 0)
  if (fx0 === N1 || fx0 - FK0 === N2) return N1 < N2 ? N1 : N2

  const bx0: number = fast_backward(BK0, N1)
  if (bx0 === 0 || bx0 - BK0 === 0) return N1 < N2 ? N1 : N2

  const diagonals_forward: number[] = new Array(L)
  const diagonals_backward: number[] = new Array(L)
  diagonals_forward[FK0] = fx0
  diagonals_backward[BK0 < 0 ? BK0 + L : BK0] = bx0

  for (let step = 1; ; ++step) {
    const parity: 0 | 1 = (step & 1) as 0 | 1
    const fkl: number = FK0 - (step < N2 ? step : N2)
    const fkr: number = FK0 + (step < N1 ? step : N1)
    const bkl: number = BK0 - (step < N1 ? step : N1)
    const bkr: number = BK0 + (step < N2 ? step : N2)

    if (step <= N1) {
      const fk: number = FK0 + step
      diagonals_forward[fk < 0 ? fk + L : fk] = fast_forward(fk, step)
    }

    if (step <= N2) {
      const fk: number = FK0 - step
      diagonals_forward[fk < 0 ? fk + L : fk] = fast_forward(fk, 0)
    }

    for (let k = FK0 - parity; k >= fkl; k -= 2) {
      if (forward(fkl, fkr, k)) {
        const s: number = step + step - 1
        return (N1 + N2 - s) / 2
      }
    }

    for (let k = FK0 + parity; k <= fkr; k += 2) {
      if (forward(fkl, fkr, k)) {
        const s: number = step + step - 1
        return (N1 + N2 - s) / 2
      }
    }

    if (step <= N1) {
      const bk: number = BK0 - step
      diagonals_backward[bk < 0 ? bk + L : bk] = fast_backward(bk, N1 - step)
    }

    if (step <= N2) {
      const bk: number = BK0 + step
      diagonals_backward[bk < 0 ? bk + L : bk] = fast_backward(bk, N1)
    }

    for (let k = BK0 - parity; k >= bkl; k -= 2) {
      if (backward(bkl, bkr, k)) {
        const s: number = step + step
        return (N1 + N2 - s) / 2
      }
    }

    for (let k = BK0 + parity; k <= bkr; k += 2) {
      if (backward(bkl, bkr, k)) {
        const s: number = step + step
        return (N1 + N2 - s) / 2
      }
    }
  }

  function fast_forward(k: number, x0: number): number {
    let x: number = x0
    for (let y: number = x - k; x < N1 && y < N2 && equals(x, y); ++x, ++y);
    return x
  }

  function fast_backward(k: number, x0: number): number {
    let x: number = x0 - 1
    for (let y: number = x - k; x >= 0 && y >= 0 && equals(x, y); --x, --y);
    return x + 1
  }

  function forward(kl: number, kr: number, k: number): boolean {
    const kid: number = k < 0 ? k + L : k
    let x: number = diagonals_forward[kid]
    if (x < N1) {
      if (k > kl) {
        const kl: number = k - 1
        const xl: number = diagonals_forward[kl < 0 ? kl + L : kl]
        if (x <= xl && xl < N1) x = xl + 1
      }
      if (k < kr) {
        const kr: number = k + 1
        const xr: number = diagonals_forward[kr < 0 ? kr + L : kr]
        if (x < xr) x = xr
      }
      diagonals_forward[kid] = fast_forward(k, x)
    }
    return diagonals_forward[kid] >= diagonals_backward[kid]
  }

  function backward(kl: number, kr: number, k: number): boolean {
    const kid: number = k < 0 ? k + L : k
    let x: number = diagonals_backward[kid]
    if (x > 0) {
      if (k > kl) {
        const kl: number = k - 1
        const xl: number = diagonals_backward[kl < 0 ? kl + L : kl]
        if (x > xl) x = xl
      }
      if (k < kr) {
        const kr: number = k + 1
        const xr: number = diagonals_backward[kr < 0 ? kr + L : kr]
        if (x >= xr && xr > 0) x = xr - 1
      }
      diagonals_backward[kid] = fast_backward(k, x)
    }
    return diagonals_forward[kid] >= diagonals_backward[kid]
  }
}
