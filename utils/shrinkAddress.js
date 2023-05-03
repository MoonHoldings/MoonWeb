import validSolanaWallet from './validSolanaWallet'

const shrinkAddress = (text) => {
  const firstSlice = text.slice(0, 3)
  const lastSlice = text.slice(-3)
  return validSolanaWallet(text) ? `${firstSlice}...${lastSlice}` : text
}

export default shrinkAddress
