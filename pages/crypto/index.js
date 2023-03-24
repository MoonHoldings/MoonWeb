import React from 'react'
import { CRYPTO_PORTFOLIO } from 'app/constants/copy'
import SidebarsLayout from 'components/nft/SidebarsLayout'
import CryptoSquare from 'components/partials/CryptoSquare'
import { Tooltip } from 'react-tippy'

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
      holding: 7000,
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

  const pct = (holding, price) => {
    let valueSum = 0
    dummyCryptos.forEach((crypto) => {
      valueSum += crypto.holding * crypto.price
    })

    const thePct = (holding * price * 100) / valueSum

    return thePct
  }
  return (
    <SidebarsLayout>
      <div className="text-white md:order-2">
        <h1 className="mb-[2.6rem] text-[2.8rem]">{CRYPTO_PORTFOLIO}</h1>
        <div className="barchart flex rounded-[1rem] bg-[#1C1F25] p-[0.5rem]">
          {dummyCryptos
            .sort((a, b) => b.holding * b.price - a.holding * a.price)
            .map((crypto, index) => (
              <>
                {pct(crypto.holding, crypto.price) > 8 ? (
                  <div
                    key={index}
                    className="flex h-[5.5rem] flex-col items-center justify-center"
                    style={{
                      background: crypto.colors.background[0],
                      color: crypto.colors.text,
                      width: pct(crypto.holding, crypto.price) + '%',
                      borderRight:
                        index !== dummyCryptos.length - 1 &&
                        '0.01px solid #000000',
                      borderTopLeftRadius: index === 0 && '0.5rem',
                      borderTopRightRadius:
                        index === dummyCryptos.length - 1 && '0.5rem',
                      borderBottomRightRadius:
                        index === dummyCryptos.length - 1 && '0.5rem',
                      borderBottomLeftRadius: index === 0 && '0.5rem',
                    }}
                  >
                    <div className="text-center text-[1.4rem] font-[600]">
                      <span>
                        {pct(crypto.holding, crypto.price) > 8 &&
                          Math.round(pct(crypto.holding, crypto.price))}
                      </span>
                      <span className="font-[300]">
                        {pct(crypto.holding, crypto.price) > 8 && '%'}
                      </span>
                    </div>
                    <div className="text-[1.4rem] font-[300] leading-[1.4rem]">
                      {pct(crypto.holding, crypto.price) > 8 && crypto.id}
                    </div>
                  </div>
                ) : (
                  <Tooltip
                    html={
                      <>
                        <div>
                          {Math.round(pct(crypto.holding, crypto.price))} %
                        </div>
                        <div>{crypto.id}</div>
                      </>
                    }
                    arrow="true"
                    size="big"
                    tag="div"
                    key={index}
                    className="flex h-[5.5rem] flex-col items-center justify-center"
                    style={{
                      background: crypto.colors.background[0],
                      color: crypto.colors.text,
                      width: pct(crypto.holding, crypto.price) + '%',
                      borderRight:
                        index !== dummyCryptos.length - 1 &&
                        '0.01px solid #000000',
                      borderTopLeftRadius: index === 0 && '0.5rem',
                      borderTopRightRadius:
                        index === dummyCryptos.length - 1 && '0.5rem',
                      borderBottomRightRadius:
                        index === dummyCryptos.length - 1 && '0.5rem',
                      borderBottomLeftRadius: index === 0 && '0.5rem',
                    }}
                  >
                    <div className="text-center text-[1.4rem] font-[600]">
                      <span>
                        {pct(crypto.holding, crypto.price) > 8 &&
                          Math.round(pct(crypto.holding, crypto.price))}
                      </span>
                      <span className="font-[300]">
                        {pct(crypto.holding, crypto.price) > 8 && '%'}
                      </span>
                    </div>
                    <div className="text-[1.4rem] font-[300] leading-[1.4rem]">
                      {pct(crypto.holding, crypto.price) > 8 && crypto.id}
                    </div>
                  </Tooltip>
                )}
              </>
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
