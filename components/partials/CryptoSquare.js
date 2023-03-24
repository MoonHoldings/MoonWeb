import Image from 'next/image'
import React from 'react'

const CryptoSquare = ({ crypto }) => {
  const totalValue = (holding, price) => {
    const value = holding * price
    return value.toLocaleString('en-US')
  }

  const numSize = (num) => {
    const length = num
      .toString()
      .split('')
      .filter((n) => n !== ',').length

    if (length === 4) {
      return 6 + 'rem'
    } else if (length === 5) {
      return 5 + 'rem'
    } else if (length === 6) {
      return 4 + 'rem'
    } else if (length === 7) {
      return 3 + 'rem'
    } else {
      return 7.5 + 'rem'
    }
  }
  return (
    <div className="cursor xl:min- relative flex min-h-min flex-col rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white active:border-[#62EAD2] xl:min-h-[23.8rem] xl:max-w-[23.8rem]  xl:hover:border-[#62EAD2]">
      <div className="headline mb-[1.6rem] flex gap-[.6rem]">
        <Image
          src="/images/svgs/btc-sample.svg"
          width={17}
          height={17}
          alt="btc"
        />
        <span className="text-[1.4rem]">{crypto.name}</span>
      </div>
      <div className="value-box absolute top-[50%] left-[50%] flex -translate-x-[50%] -translate-y-[50%] flex-col items-center">
        <h1
          style={{ fontSize: numSize(crypto.holding) }}
          className="quantity font-[700] leading-[9.07rem]"
        >
          {crypto.holding.toLocaleString('en-US')}
        </h1>
        <div className="value-dollar text-[2.2rem] font-[500]">
          ${totalValue(crypto.holding, crypto.price)}
        </div>
        <div className="pct-dollar flex justify-center">
          <div className="mr-2 text-[#62EAD2]">+0.45%</div>
          <div>$16,823.23</div>
        </div>
      </div>
    </div>
  )
}

export default CryptoSquare
