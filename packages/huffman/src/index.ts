import { compress, decompress } from './compress'
import { decode, encode } from './encode'
import { fromEncodingTable, fromText, toEncodingTable } from './huffman'

export * from './compress'
export * from './encode'
export * from './huffman'

export default {
  encode,
  decode,
  compress,
  decompress,
  fromText,
  fromEncodingTable,
  toEncodingTable,
}
