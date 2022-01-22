import { compress, decompress } from './compress'
import { decode, encode } from './encode'
import { buildEncodingTable, buildHuffmanTree, createHuffmanTree } from './huffman'

export * from './compress'
export * from './encode'
export * from './huffman'

export default {
  encode,
  decode,
  compress,
  decompress,
  buildEncodingTable,
  createHuffmanTree,
  buildHuffmanTree,
}
