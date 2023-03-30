const isShortCurrencyFormat = (amount) => {
  if (!amount) {
    return false
  }

  return (
    amount.includes('k') ||
    amount.includes('m') ||
    amount.includes('b') ||
    amount.includes('t')
  )
}

export default isShortCurrencyFormat
