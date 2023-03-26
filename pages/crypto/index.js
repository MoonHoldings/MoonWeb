import React from 'react'
import { CRYPTO_PORTFOLIO } from 'app/constants/copy'
import SidebarsLayout from 'components/nft/SidebarsLayout'
import CryptoSquare from 'components/partials/CryptoSquare'
import { Tooltip } from 'react-tippy'
import SingleBar from 'components/crypto/SingleBar'

const index = () => {
  const dummyCryptos = [
    {
      name: 'Bitcoin',
      id: 'BTC',
      holding: 6,
      price: 24000,
      colors: {
        text: '#000',
        background: ['#F7931A', '#FFC783'],
      },
    },
    {
      name: 'Ethereum',
      id: 'ETH',
      holding: 15,
      price: 1700,
      colors: {
        text: '#fff',
        background: ['#761FC3', '#19012F'],
      },
    },
    {
      name: 'Solana',
      id: 'SOL',
      holding: 800,
      price: 24,
      colors: {
        text: '#fff',
        background: ['#5B218F', '#DB00FF'],
      },
    },
    {
      name: 'Tether',
      id: 'USDT',
      holding: 27000,
      price: 1,
      colors: {
        text: '#fff',
        background: ['#53AE94'],
      },
    },
    {
      name: 'Polkadot',
      id: 'DOT',
      holding: 6000,
      price: 6.4,
      colors: {
        text: '#fff',
        background: ['#E6007A'],
      },
    },
    {
      name: 'Litecoin',
      id: 'LTC',
      holding: 25,
      price: 80,
      colors: {
        text: '#000',
        background: ['#BEBEBE'],
      },
    },
  ]

  return (
    <SidebarsLayout>
      <div className="text-white md:order-2">
        <h1 className="mb-[2.6rem] text-[2.8rem]">{CRYPTO_PORTFOLIO}</h1>
        <div className="barchart flex rounded-[1rem] bg-[#1C1F25] p-[0.5rem]">
          {dummyCryptos
            .sort((a, b) => b.holding * b.price - a.holding * a.price)
            .map((crypto, index) => (
              <SingleBar
                crypto={crypto}
                dummyCryptos={dummyCryptos}
                index={index}
                key={index}
              />
            ))}
        </div>
        <div className="nft-cards mt-[2rem] grid grid-cols-2 gap-x-[2rem] gap-y-[2rem] sm:grid-cols-3 sm:gap-x-[1.3rem] sm:gap-y-[1.5rem] xl:grid-cols-3">
          {dummyCryptos
            .sort((a, b) => b.holding * b.price - a.holding * a.price)
            .map((crypto, index) => (
              <CryptoSquare key={index} crypto={crypto} />
            ))}
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default index
