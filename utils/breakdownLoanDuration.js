import { zonedTimeToUtc } from 'date-fns-tz'

const breakdownLoanDuration = (start, duration) => {
  // Get the current date and time
  const startDate = new Date(start * 1000)
  const now = zonedTimeToUtc(new Date(), 'Etc/GMT-4')

  // Convert duration to milliseconds
  const durationMs = duration * 1000

  // Calculate the target date and time
  const target = new Date(startDate.getTime() + durationMs)

  // Calculate the difference in milliseconds
  const diffMs = target - now

  // Calculate the remaining days, hours, minutes, and seconds
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  // Return the breakdown as an object
  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

export default breakdownLoanDuration
