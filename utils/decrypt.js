import { CRYPTO_SECRET } from 'app/constants/api'
import CryptoJS from 'crypto-js'

const decrypt = (tobeDecrypted) => {
  const bytes = CryptoJS.AES.decrypt(tobeDecrypted, CRYPTO_SECRET)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)

  return JSON.parse(originalText)
}

export default decrypt
