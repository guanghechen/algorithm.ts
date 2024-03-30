import { PriorityQueue } from '@algorithm.ts/queue'

export interface IHuffmanNode {
  value?: string
  left?: IHuffmanNode
  right?: IHuffmanNode
}

export type IHuffmanEncodedData = Array<0 | 1>

export type IHuffmanEncodingTable = Record<string, IHuffmanEncodedData>

/**
 * Create a Huffman tree from the specified text.
 * @param text
 * @returns
 */
export function fromText(text: string): IHuffmanNode {
  const costMap: Record<string, number> = {}
  for (const c of text) {
    const cnt: number = costMap[c] ?? 0
    costMap[c] = cnt + 1
  }

  const entries = Object.entries(costMap)
  if (entries.length <= 0) return {}

  const minHeap = new PriorityQueue<{
    cost: number
    node: IHuffmanNode
  }>({ compare: (x, y) => x.cost - y.cost })
  minHeap.init()
  minHeap.enqueues(entries.map(([value, cost]) => ({ cost, node: { value } })))

  while (minHeap.size > 1) {
    const o1 = minHeap.dequeue()!
    const o2 = minHeap.dequeue()!
    const o: IHuffmanNode = { left: o1.node, right: o2.node }
    minHeap.enqueue({
      cost: o1.cost + o2.cost,
      node: o,
    })
  }
  return minHeap.front()!.node
}

/**
 * Build a huffman tree based on HuffmanEncodingTable.
 * @param table
 * @returns
 */
export function fromEncodingTable(table: IHuffmanEncodingTable): IHuffmanNode {
  const entries = Object.entries(table)
  if (entries.length === 0) return {}

  const root: IHuffmanNode = {}
  for (const [value, path] of entries) {
    let o = root
    for (const x of path) {
      if (x === 0) {
        if (o.left === undefined) o.left = {}
        o = o.left
      } else {
        if (o.right === undefined) o.right = {}
        o = o.right
      }
    }
    o.value = value
  }
  return root
}

/**
 * Build a HuffmanEncodingTable based on Huffman tree.
 * @param tree
 * @returns
 */
export function toEncodingTable(tree: IHuffmanNode): IHuffmanEncodingTable {
  const prefix: IHuffmanEncodedData = []
  const encodingTable: IHuffmanEncodingTable = {}
  collect(tree, 0)
  return encodingTable

  function collect(node: IHuffmanNode, cur: number): void {
    if (node.value) encodingTable[node.value] = prefix.slice(0, cur)
    else {
      if (node.left) {
        prefix[cur] = 0
        collect(node.left, cur + 1)
      }
      if (node.right) {
        prefix[cur] = 1
        collect(node.right, cur + 1)
      }
    }
  }
}
