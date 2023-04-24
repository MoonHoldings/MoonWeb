import { CRYPTO_SECRET } from 'app/constants/be'
import CryptoJS from 'crypto-js'

export default (tobeEncrypted) => {
  const encryptedText = CryptoJS.AES.encrypt(
    JSON.stringify(tobeEncrypted),
    CRYPTO_SECRET
  )

  return encryptedText
}
