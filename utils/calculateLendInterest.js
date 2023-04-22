const calculateLendInterest = (amount, duration, apy, feePermillicentage) => {
  if (!amount) return 0

  const apr = apy / 1000
  const interestRatio =
    Math.exp((duration / (365 * 24 * 60 * 60)) * (apr / 100)) - 1
  const interestLamports =
    amount * interestRatio * (1 - feePermillicentage / 100_000)

  if (interestLamports < 0.001) return 0
  return interestLamports.toFixed(interestLamports < 0.01 ? 3 : 2)
}

export default calculateLendInterest
