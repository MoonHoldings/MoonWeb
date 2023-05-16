import Image from 'next/image'
import React from 'react'
import numeral from 'numeral'

const CryptoSquare = ({ crypto, handleCoinClick, loading }) => {
  const totalValue = (holding, price) => {
    const value = holding * price
    return numeral(value).format('0,0.00')
  }

  function formatNumber(value) {
    const formattedValue = value.toFixed(2)

    if (formattedValue.includes('.') && !formattedValue.endsWith('0')) {
      return formattedValue
    }

    return parseFloat(formattedValue).toString()
  }
  const formattedHolding = (holding) => {
    const length = holding
      .toString()
      .split('')
      .filter((n) => n !== ',').length

    if (length > 7) {
      return numeral(holding).format('0a')
    } else {
      if (holding % 1 == 0) return numeral(holding).format('0,0')
      else return formatNumber(holding)
    }
  }

  const numSize = (num) => {
    const length = formatNumber(num)
      .toString()
      .split('')
      .filter((n) => n !== ',').length

    if (length === 4) {
      return 4 + 'rem'
    } else if (length === 3) {
      return 6 + 'rem'
    } else if (length === 5) {
      return 5 + 'rem'
    } else if (length === 6) {
      return 4 + 'rem'
    } else if (length >= 7) {
      return 5 + 'rem'
    } else {
      return 7.5 + 'rem'
    }
  }
  return (
    <button
      disabled={loading}
      onClick={handleCoinClick}
      className={`relative flex min-h-[24rem] max-w-[23.8rem] flex-col overflow-hidden rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white ${
        !loading && 'cursor hover:border-[#62EAD2] active:border-[#62EAD2]'
      } md:max-w-[28rem]`}
    >
      <div className="headline mb-[1.6rem] flex gap-[.6rem]">
        <Image src={crypto.svg} width={17} height={17} alt="btc" />
        <span className="text-[1.4rem]">{crypto.name}</span>
      </div>
      <div className="value-box absolute left-[50%] top-[50%] flex -translate-x-[50%] -translate-y-[50%] flex-col items-center">
        <h1
          style={{
            fontSize: numSize(crypto.holdings),
            color: crypto.color,
          }}
          className="quantity font-[700] leading-[8.07rem]"
        >
          {formattedHolding(crypto.holdings)}
        </h1>
        <div className="value-dollar text-[2.2rem] font-[500]">
          ${totalValue(crypto.holdings, crypto.price)}
        </div>
        <div className="pct-dollar flex justify-center">
          <div>{`$${crypto.price}`}</div>
        </div>
      </div>
    </button>
  )
}

export default CryptoSquare
