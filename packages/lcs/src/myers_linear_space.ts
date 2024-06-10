/**
 * Find a least match for the longest common subsequence.
 *
 * @param N1
 * @param N2
 * @param equals
 * @returns
 * @see http://www.xmailserver.org/diff2.pdf An O(ND) Difference Algorithm and Its Variations
 */
export function myers_linear_space(
  N1: number,
  N2: number,
  equals: (x: number, y: number) => boolean,
): Array<[number, number]> {
  if (N1 <= 0 || N2 <= 0) return []

  const L: number = N1 + N2 + 1
  const diagonals_forward: number[] = new Array(L)
  const diagonals_backward: number[] = new Array(L)
  const answers: Array<[number, number]> = []

  lcs(0, 0, N1, N2)
  return answers

  function lcs(Xl: number, Yl: number, Xr: number, Yr: number): void {
    if (Xl >= Xr || Yl >= Yr) return

    if (Xl + 1 === Xr) {
      let y: number = Yl
      while (y < Yr && !equals(Xl, y)) ++y
      if (y < Yr) answers.push([Xl, y])
      return
    }

    if (Yl + 1 === Yr) {
      let x = Xl
      while (x < Xr && !equals(x, Yl)) ++x
      if (x < Xr) answers.push([x, Yl])
      return
    }

    const [mu, mv, step1, step2] = find_middle(Xl, Yl, Xr, Yr)
    let u: number = mu
    let v: number = mv

    // Optimize: if no diagonal is found, skip the recursion.
    if (u - Xl + v - Yl > step1) lcs(Xl, Yl, u, v)

    // Collect middle snake.
    for (; u < Xr && v < Yr && equals(u, v); ++u, ++v) answers.push([u, v])

    // Optimize: if no diagonal is found, skip the recursion.
    if (Xr - u + Yr - v > step2) lcs(u, v, Xr, Yr)
  }

  function find_middle(
    Xl: number,
    Yl: number,
    Xr: number,
    Yr: number,
  ): [mu: number, mv: number, step1: number, step2: number] {
    const M: number = Xr - Xl
    const N: number = Yr - Yl
    const FK0: number = Xl - Yl // y = x - k ===> k = x - y
    const BK0: number = Xr - Yr // y = x - k ===> k = x - y

    const fx0: number = fast_forward(Xr, Yr, FK0, Xl)
    const fy0: number = fx0 - FK0
    if (fx0 === Xr || fy0 === Yr) return [Xl, Yl, 0, Xr - fx0 + Yr - fy0]

    const bx0: number = fast_backward(Xl, Yl, BK0, Xr)
    const by0: number = bx0 - BK0
    if (bx0 === Xl || by0 === Yl) return [bx0, by0, bx0 - Xl + by0 - Yl, 0]

    diagonals_forward.fill(-1)
    diagonals_backward.fill(L + 1)
    diagonals_forward[FK0 < 0 ? FK0 + L : FK0] = fx0
    diagonals_backward[BK0 < 0 ? BK0 + L : BK0] = bx0

    for (let step = 1; ; ++step) {
      const parity: 0 | 1 = (step & 1) as 0 | 1
      const fkl: number = FK0 - (step < N ? step : N)
      const fkr: number = FK0 + (step < M ? step : M)
      const bkl: number = BK0 - (step < M ? step : M)
      const bkr: number = BK0 + (step < N ? step : N)

      if (step <= N) {
        const fk: number = FK0 - step
        diagonals_forward[fk < 0 ? fk + L : fk] = fast_forward(Xr, Yr, fk, Xl)

        const bk: number = BK0 + step
        diagonals_backward[bk < 0 ? bk + L : bk] = fast_backward(Xl, Yl, bk, Xr)
      }

      if (step <= M) {
        const fk: number = FK0 + step
        diagonals_forward[fk < 0 ? fk + L : fk] = fast_forward(Xr, Yr, fk, Xl + step)

        const bk: number = BK0 - step
        diagonals_backward[bk < 0 ? bk + L : bk] = fast_backward(Xl, Yl, bk, Xr - step)
      }

      for (let k = FK0 - parity; k >= fkl; k -= 2) {
        const x: number = forward(Xr, Yr, fkl, fkr, k)
        if (x !== -1) return [x, x - k, step, step - 1]
      }

      for (let k = FK0 + parity; k <= fkr; k += 2) {
        const x: number = forward(Xr, Yr, fkl, fkr, k)
        if (x !== -1) return [x, x - k, step, step - 1]
      }

      for (let k = BK0 - parity; k >= bkl; k -= 2) {
        const x: number = backward(Xl, Yl, bkl, bkr, k)
        if (x !== -1) return [x, x - k, step, step]
      }

      for (let k = BK0 + parity; k <= bkr; k += 2) {
        const x: number = backward(Xl, Yl, bkl, bkr, k)
        if (x !== -1) return [x, x - k, step, step]
      }
    }
  }

  function fast_forward(Xr: number, Yr: number, k: number, x0: number): number {
    let x: number = x0
    for (let y: number = x - k; x < Xr && y < Yr && equals(x, y); ++x, ++y);
    return x
  }

  function fast_backward(Xl: number, Yl: number, k: number, x0: number): number {
    let x: number = x0 - 1
    for (let y: number = x - k; x >= Xl && y >= Yl && equals(x, y); --x, --y);
    return x + 1
  }

  function forward(Xr: number, Yr: number, Kl: number, Kr: number, k: number): number {
    const kid: number = k < 0 ? k + L : k
    let x: number = diagonals_forward[kid]
    if (x < Xr) {
      if (k > Kl) {
        const kl: number = k - 1
        const xl: number = diagonals_forward[kl < 0 ? kl + L : kl]
        if (x <= xl && xl < Xr) x = xl + 1
      }
      if (k < Kr) {
        const kr: number = k + 1
        const xr: number = diagonals_forward[kr < 0 ? kr + L : kr]
        if (x < xr) x = xr
      }
      diagonals_forward[kid] = fast_forward(Xr, Yr, k, x)
    }
    return diagonals_forward[kid] >= diagonals_backward[kid] ? x : -1
  }

  function backward(Xl: number, Yl: number, Kl: number, Kr: number, k: number): number {
    const kid: number = k < 0 ? k + L : k
    let x: number = diagonals_backward[kid]
    if (x > Xl) {
      if (k > Kl) {
        const kl: number = k - 1
        const xl: number = diagonals_backward[kl < 0 ? kl + L : kl]
        if (x > xl) x = xl
      }
      if (k < Kr) {
        const kr: number = k + 1
        const xr: number = diagonals_backward[kr < 0 ? kr + L : kr]
        if (x >= xr && xr > Xl) x = xr - 1
      }
      x = diagonals_backward[kid] = fast_backward(Xl, Yl, k, x)
    }
    return diagonals_forward[kid] >= diagonals_backward[kid] ? x : -1
  }
}
