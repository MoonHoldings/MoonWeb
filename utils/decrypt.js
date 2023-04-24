import { CRYPTO_SECRET } from 'app/constants/be'
import CryptoJS from 'crypto-js'

export default (tobeEncrypted) => {
  const bytes = CryptoJS.AES.decrypt(tobeEncrypted, CRYPTO_SECRET)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)

  return JSON.parse(originalText)
}
