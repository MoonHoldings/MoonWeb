import { CRYPTO_SECRET } from 'app/constants/api'
import CryptoJS from 'crypto-js'

export default (tobeEncrypted) => {
  const encryptedText = CryptoJS.AES.encrypt(
    JSON.stringify(tobeEncrypted),
    CRYPTO_SECRET
  )

  return encryptedText
}
