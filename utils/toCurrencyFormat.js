// Helper function to formatamount to decimal format with commas for thousands (Ex. 2,000.00)
const toCurrencyFormat = (value) => {
  return Number.isInteger(value) || !Number.isNaN(Number(value))
    ? value
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '0.00'
}

export default toCurrencyFormat
