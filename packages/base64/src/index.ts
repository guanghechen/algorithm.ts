import { Base64 } from './base64'

export * from './base64'

const base64 = new Base64()

export const encode = base64.encode.bind(base64)
export const decode = base64.decode.bind(base64)
export const validate = base64.validate.bind(base64)
export default { encode, decode, validate }
