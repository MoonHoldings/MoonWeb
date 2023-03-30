import SidebarsLayout from 'components/nft/SidebarsLayout'
import NFTCard from 'components/partials/NFTCard'
import { useRouter } from 'next/router'
import React from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'

import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import TextBlink from 'components/partials/TextBlink'
import { Tooltip } from 'flowbite-react'
import isShortCurrencyFormat from 'utils/isShortCurrencyFormat'
import toShortCurrencyFormat from 'utils/toShortCurrencyFormat'

const Index = () => {
  const router = useRouter()
  const { currentCollection } = useSelector((state) => state.wallet)
  const { solUsdPrice } = useSelector((state) => state.crypto)

  const handleClick = (url) => {
    router.push(`/${url}`)
  }

  const formatFloorPrice = () => {
    return toCurrencyFormat(
      parseFloat(currentCollection.floorPrice.floorPriceLamports) /
        LAMPORTS_PER_SOL
    )
  }

  const formatFloorPriceUsd = () => {
    return `$${toCurrencyFormat(
      (parseFloat(currentCollection.floorPrice.floorPriceLamports) /
        LAMPORTS_PER_SOL) *
        solUsdPrice
    )}`
  }

  const formatShortFloorPriceUsd = () => {
    return `$${toShortCurrencyFormat(
      (parseFloat(currentCollection.floorPrice.floorPriceLamports) /
        LAMPORTS_PER_SOL) *
        solUsdPrice
    )}`
  }

  const formatFloorPriceTotal = () => {
    return toCurrencyFormat(
      (parseFloat(currentCollection.floorPrice.floorPriceLamports) /
        LAMPORTS_PER_SOL) *
        currentCollection?.nfts?.length
    )
  }

  const formatFloorPriceUsdTotal = () => {
    return `$${toCurrencyFormat(
      (parseFloat(currentCollection.floorPrice.floorPriceLamports) /
        LAMPORTS_PER_SOL) *
        solUsdPrice *
        currentCollection?.nfts?.length
    )}`
  }

  const formatShortFloorPriceUsdTotal = () => {
    return `$${toShortCurrencyFormat(
      (parseFloat(currentCollection.floorPrice.floorPriceLamports) /
        LAMPORTS_PER_SOL) *
        solUsdPrice *
        currentCollection?.nfts?.length
    )}`
  }

  return (
    <SidebarsLayout>
      <div className="mt-[2rem] text-white md:order-2">
        <div className="flex items-center text-center">
          <div
            onClick={() => handleClick('nfts')}
            className="cursor mr-4 text-[2rem] underline"
          >
            NFT Portfolio
          </div>
          <div className="flex items-center text-[2.2rem] md:text-[2.9rem]">
            &gt;
            <span className="ml-4">{currentCollection.name}</span>
          </div>
        </div>
        <p className="text-[1.6rem]">
          You have <span>{currentCollection?.nfts?.length}</span>{' '}
          {currentCollection.name} NFTs
        </p>
        {currentCollection.floorPrice && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bold flex items-center text-center text-[1.5rem] md:text-[2rem]">
                Floor Price:
                <div className="ml-4 flex items-center">
                  {formatFloorPrice()}
                  <Image
                    className="ml-1 inline h-[1.5rem] w-[1.5rem] xl:h-[2rem] xl:w-[2rem]"
                    src="/images/svgs/sol-symbol.svg"
                    alt="SOL Symbol"
                    width={0}
                    height={0}
                    unoptimized
                  />
                </div>
              </div>
              <Tooltip
                className="rounded-xl py-[1.5rem] px-[2rem]"
                content={
                  <span className="flex h-full items-center text-[1.5rem] md:text-[2rem]">
                    {formatFloorPriceUsd()}
                  </span>
                }
                placement="bottom"
                trigger={
                  isShortCurrencyFormat(formatShortFloorPriceUsd())
                    ? 'hover'
                    : null
                }
              >
                <TextBlink
                  className="bold ml-4 text-[1.5rem] md:text-[2rem]"
                  text={formatShortFloorPriceUsd()}
                />
              </Tooltip>
            </div>

            <div className="flex items-center">
              <div className="bold flex items-center text-center text-[1.5rem] md:text-[2rem]">
                Total Value:
                <div className="ml-4 flex items-center">
                  {formatFloorPriceTotal()}
                  <Image
                    className="ml-1 inline h-[1.5rem] w-[1.5rem] xl:h-[2rem] xl:w-[2rem]"
                    src="/images/svgs/sol-symbol.svg"
                    alt="SOL Symbol"
                    width={0}
                    height={0}
                    unoptimized
                  />
                </div>
              </div>
              <Tooltip
                className="rounded-xl py-[1.5rem] px-[2rem]"
                content={
                  <span className="flex h-full items-center text-[1.5rem] md:text-[2rem]">
                    {formatFloorPriceUsdTotal()}
                  </span>
                }
                placement="bottom"
                trigger={
                  isShortCurrencyFormat(formatShortFloorPriceUsdTotal())
                    ? 'hover'
                    : null
                }
              >
                <TextBlink
                  className="bold ml-4 text-[1.5rem] md:text-[2rem]"
                  text={formatShortFloorPriceUsdTotal()}
                />
              </Tooltip>
            </div>
          </div>
        )}
        <div className="h grid grid-cols-2 gap-6 py-[2rem] xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 4xl:grid-cols-8">
          {currentCollection.nfts?.map((nft, index) => (
            <NFTCard
              key={index}
              floorPrice={currentCollection.floorPrice}
              nft={nft}
            />
          ))}
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default Index
