import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const convertUnixTimestamp = (unixTimestamp) => {
  const timestamp = unixTimestamp // Unix timestamp

  // Create a new Date object using the timestamp multiplied by 1000 (to convert from seconds to milliseconds)
  const date = new Date(timestamp * 1000)

  // Extract the different components of the date
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // Note: Months are zero-indexed, so we add 1
  const day = date.getDate()

  // Format the date as a string
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`

  return formattedDate
}

const formatPrice = (price) => {
  return price / LAMPORTS_PER_SOL
}

export const formatChartData = (candleData) => {
  const chartData = candleData
    .map((item) => {
      return {
        time: item.startTime,
        high: formatPrice(item.high),
        low: formatPrice(item.low),
        open: formatPrice(item.open),
        close: formatPrice(item.close),
      }
    })
    .reverse()
  return chartData
}
