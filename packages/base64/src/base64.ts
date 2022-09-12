export interface IBase64Props {
  /**
   * @default 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
   */
  CODES?: string
  /**
   * @default '=''
   */
  CODE_PADDING?: string
}

const sanitizeRegex = /([*^$\\])/g

export class Base64 {
  protected readonly CODE_LIST: string[]
  protected readonly CODE_REFLECT: Record<string, number>
  protected readonly CODE_PADDING: string
  protected readonly VALIDATE_REGEX: RegExp

  constructor(props: IBase64Props = {}) {
    const CODES =
      props.CODES?.length === 64
        ? props.CODES
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    const CODE_PADDING = props.CODE_PADDING?.length === 1 ? props.CODE_PADDING : '='

    this.CODE_LIST = CODES.split('')
    this.CODE_REFLECT = this.CODE_LIST.reduce((acc, v, idx) => ({ ...acc, [v]: idx }), {
      [CODE_PADDING]: 0,
    })
    this.VALIDATE_REGEX = new RegExp(
      `^[${CODES.replace(sanitizeRegex, '\\$1')}]+${CODE_PADDING.replace(
        sanitizeRegex,
        '\\$1',
      )}{0,2}$`,
    )
    this.CODE_PADDING = CODE_PADDING
  }

  public encode(data: Uint8Array): string {
    let result = ''
    const _end: number = Math.floor(data.length / 3) * 3
    for (let i = 0; i < _end; i += 3) {
      result += this._encodeUnit((data[i] << 16) | (data[i + 1] << 8) | data[i + 2])
    }

    const { CODE_PADDING } = this
    switch (data.length - _end) {
      case 1: {
        const tail: string = this._encodeUnit(data[_end] << 16)
        result += tail.slice(0, 2) + CODE_PADDING + CODE_PADDING
        break
      }
      case 2: {
        const tail: string = this._encodeUnit((data[_end] << 16) | (data[_end + 1] << 8))
        result += tail.slice(0, 3) + CODE_PADDING
      }
    }
    return result
  }

  public decode(text: string): Uint8Array | never {
    if (text.length <= 0 || !this.validate(text)) {
      throw new TypeError('Invalid base64 string.')
    }

    let countOfPadding = 0
    const { CODE_PADDING } = this
    for (let i = text.length - 1; i >= 0 && text[i] === CODE_PADDING; --i) countOfPadding += 1
    const _size: number = (text.length >> 2) * 3 - countOfPadding
    const result: Uint8Array = new Uint8Array(_size)

    const _end: number = ((text.length - countOfPadding) >> 2) << 2
    let i = 0
    let j = 0
    for (; i < _end; i += 4, j += 3) {
      const v: number = this._decodeUint(text, i)
      result[j] = v >> 16
      result[j + 1] = (v >> 8) & 0xff
      result[j + 2] = v & 0xff
    }

    if (countOfPadding > 0) {
      const v: number = this._decodeUint(text, i)
      switch (countOfPadding) {
        case 1: {
          result[j] = v >> 16
          result[j + 1] = (v >> 8) & 0xff
          break
        }
        case 2: {
          result[j] = v >> 16
          break
        }
      }
    }
    return result
  }

  public validate(text: string): boolean {
    // The length of a Base64 encoded string should be a multiple of 4.
    if (text.length & 3) return false
    return this.VALIDATE_REGEX.test(text)
  }

  protected _encodeUnit(v: number): string {
    const { CODE_LIST } = this
    return (
      CODE_LIST[(v >> 18) & 0x3f] +
      CODE_LIST[(v >> 12) & 0x3f] +
      CODE_LIST[(v >> 6) & 0x3f] +
      CODE_LIST[v & 0x3f]
    )
  }

  protected _decodeUint(text: string, startIdx: number): number {
    const { CODE_REFLECT } = this
    const v: number =
      (CODE_REFLECT[text.charAt(startIdx)] << 18) |
      (CODE_REFLECT[text.charAt(startIdx | 1)] << 12) |
      (CODE_REFLECT[text.charAt(startIdx | 2)] << 6) |
      CODE_REFLECT[text.charAt(startIdx | 3)]
    return v
  }
}
