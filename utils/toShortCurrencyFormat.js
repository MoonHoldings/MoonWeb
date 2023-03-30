import toCurrencyFormat from './toCurrencyFormat'

function toShortCurrencyFormat(num) {
  if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(1) + 'k'
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(1) + 'm'
  } else if (num >= 1000000000 && num < 1000000000000) {
    return (num / 1000000000).toFixed(1) + 'b'
  } else if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(1) + 't'
  } else {
    return toCurrencyFormat(num)
  }
}

export default toShortCurrencyFormat
