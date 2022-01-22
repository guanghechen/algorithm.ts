import { buildEncodingTable, createHuffmanTree } from './huffman'
import type { IHuffmanEncodedData, IHuffmanEncodingTable, IHuffmanNode } from './huffman'

/**
 * Encode texts through Huffman encode algorithm.
 * @param plaintext
 * @returns
 */
export function encode(plaintext: string): {
  encodedData: IHuffmanEncodedData
  encodingTable: IHuffmanEncodingTable
  tree: IHuffmanNode
} {
  const tree: IHuffmanNode = createHuffmanTree(plaintext)
  const encodedData: Array<0 | 1> = []
  const encodingTable: IHuffmanEncodingTable = buildEncodingTable(tree)
  for (const c of plaintext) {
    // Invariant: data should not be null / undefined.
    const data: IHuffmanEncodedData = encodingTable[c]
    encodedData.push(...data)
  }
  return { encodedData, encodingTable, tree }
}

/**
 * @param encodedData
 * @param tree
 * @returns
 */
export function decode(encodedData: IHuffmanEncodedData, tree: IHuffmanNode): string {
  const L: number = encodedData.length
  if (L <= 0) return ''

  let i = 0
  let o: IHuffmanNode | undefined
  let plainText = ''

  while (i < L) {
    for (o = tree; o && o.value === undefined; ++i) {
      o = encodedData[i] === 0 ? o.left! : o.right!
    }
    if (o?.value === undefined) break
    plainText += o.value
  }

  if (i !== L || o?.value === undefined) {
    throw new TypeError('Bad encoded data or huffman tree.')
  }
  return plainText
}
