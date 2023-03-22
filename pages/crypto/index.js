import React from 'react'
import { CRYPTO_PORTFOLIO } from 'app/constants/copy'
import SidebarsLayout from 'components/nft/SidebarsLayout'
import CryptoSquare from 'components/partials/CryptoSquare'

const index = () => {
  return (
    <SidebarsLayout>
      <div className="text-white md:order-2">
        <h1 className="text-[2.8rem]">{CRYPTO_PORTFOLIO}</h1>
        <div className="nft-cards mt-[2rem] grid grid-cols-2 gap-x-[2rem] gap-y-[2rem] sm:grid-cols-3 sm:gap-x-[1.3rem] sm:gap-y-[1.5rem] xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <CryptoSquare key={num} />
          ))}
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default index
