export const createDebugInfo = (...info: unknown[]): string => {
  return info
    .map(value => {
      if (value === null) return 'null'
      if (value === undefined) return 'undefined'
      switch (typeof value) {
        case 'number':
        case 'bigint':
        case 'boolean':
        case 'string':
          return String(value)
        default:
          return JSON.stringify(value)
      }
    })
    .join(' -+- ')
}
