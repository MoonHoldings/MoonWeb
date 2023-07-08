import { validate } from 'bitcoin-address-validation'

const validBitcoinWallet = (address) => {
  try {
    return validate(address)
  } catch (error) {
    return false
  }
}

export default validBitcoinWallet
