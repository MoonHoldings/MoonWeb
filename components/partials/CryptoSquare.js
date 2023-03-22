import Image from 'next/image'
import React from 'react'

const CryptoSquare = () => {
  return (
    <div className="cursor xl:min- relative flex min-h-min flex-col rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white active:border-[#62EAD2] xl:min-h-[23.8rem] xl:max-w-[23.8rem]  xl:hover:border-[#62EAD2]">
      <div className="headline mb-[1.6rem] flex gap-[.6rem]">
        <Image
          src="/images/svgs/btc-sample.svg"
          width={17}
          height={17}
          alt="btc"
        />
        <span className="text-[1.4rem]">Bitcoin</span>
      </div>
      <div className="value-box absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        <h1 className="quantity text-[7.5rem] font-[700] leading-[9.07rem]">
          54
        </h1>
        <div className="value-dollar text-[2.2rem] font-[500]">$345,987</div>
        <div className="pct-dollar flex justify-center">
          <div className="mr-2 text-[#62EAD2]">+0.45%</div>
          <div>$16,823.23</div>
        </div>
      </div>
    </div>
  )
}

export default CryptoSquare
