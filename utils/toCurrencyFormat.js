// Helper function to format amount to decimal format with commas for thousands (Ex. 2,000.00)
const toCurrencyFormat = (value) => {
  if (value < 0.09) {
    return Number.isInteger(value) || !Number.isNaN(Number(value))
      ? value.toFixed(5).toString()
      : '0.00'
  } else
    return Number.isInteger(value) || !Number.isNaN(Number(value))
      ? value
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : '0.00'
}

export default toCurrencyFormat
