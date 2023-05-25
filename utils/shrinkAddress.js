import validSolanaWallet from './validSolanaWallet'

const shrinkAddress = (text) => {
  if (!text) return ''
  const firstSlice = text.slice(0, 3)
  const lastSlice = text.slice(-3)
  return validSolanaWallet(text) ? `${firstSlice}...${lastSlice}` : text
}

export default shrinkAddress
