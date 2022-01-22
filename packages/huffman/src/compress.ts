export function compress(data: ReadonlyArray<0 | 1>): Uint8Array {
  const N: number = data.length
  const total = Math.ceil(N / 8)
  const result: Uint8Array = new Uint8Array(total + 1)

  // How many valid bits of the last data byte.
  result[0] = N & 7 ? N & 7 : 8

  let t = 0
  for (let i = 1; i < total; ++i, t += 8) {
    const value: number =
      (data[t] << 7) |
      (data[t + 1] << 6) |
      (data[t + 2] << 5) |
      (data[t + 3] << 4) |
      (data[t + 4] << 3) |
      (data[t + 5] << 2) |
      (data[t + 6] << 1) |
      data[t + 7]
    result[i] = value
  }

  let value = 0
  for (; t < data.length; ++t) value = (value << 1) | data[t]
  result[total] = value
  return result
}

export function decompress(data: Uint8Array): Array<0 | 1> {
  const size: number = data.length
  const result: Array<0 | 1> = []
  for (let i = 1, _end = size - 1; i < _end; ++i) {
    const v: number = data[i]
    for (let x = 0x80; x > 0; x >>= 1) result.push(v & x ? 1 : 0)
  }

  // Last data byte.
  {
    const validBits: number = data[0]
    if (validBits > 0) {
      const v: number = data[size - 1]
      for (let x = 1 << (validBits - 1); x > 0; x >>= 1) result.push(v & x ? 1 : 0)
    }
  }
  return result
}
