import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import SidebarsLayout from 'components/partials/SidebarsLayout'
import Attribute from 'components/nft/AttributeBox'

import toCurrencyFormat from 'utils/toCurrencyFormat'

const Nft = () => {
  const router = useRouter()
  const { currentNft, currentCollection } = useSelector((state) => state.wallet)
  const { solUsdPrice } = useSelector((state) => state.crypto)

  const image = currentNft.image_uri
  const name = currentNft.name?.length ? currentNft.name : currentNft.symbol

  const handleClick = (url) => router.push(`/${url}`)

  const formatFloorPrice = () => {
    return toCurrencyFormat(
      parseFloat(currentCollection?.floorPrice?.floorPriceLamports) /
        LAMPORTS_PER_SOL
    )
  }

  const formatFloorPriceUsd = () => {
    return `$${toCurrencyFormat(
      (parseFloat(currentCollection?.floorPrice?.floorPriceLamports) /
        LAMPORTS_PER_SOL) *
        solUsdPrice
    )}`
  }

  return (
    <SidebarsLayout>
      <div className="py-[2rem] md:order-2">
        <div className="flex items-center text-center">
          <div
            onClick={() => handleClick('nfts')}
            className="cursor mr-4 text-[2rem] underline"
          >
            NFT Portfolio
          </div>
          <div
            onClick={() => handleClick('nfts/collection')} // TODO < need to dynamically load previous collection
            className="cursor mr-4 flex items-center text-[2rem]"
          >
            &gt;
            <span className="ml-4  underline">{currentCollection.name}</span>
          </div>
          <div className="flex items-center text-[2.9rem]">
            &gt;
            <span className="ml-4">{name}</span>
          </div>
        </div>

        <div className="nft-cards mt-[2rem] flex flex-col sm:flex-row">
          <div className="cursor mb-[2rem] flex w-[280px] rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white">
            <Image
              className="mb-[1rem] h-full w-full rounded-[1rem] object-cover xl:mb-[1.5rem]"
              src={image}
              width="342"
              height="444"
              alt="NFT picture"
            />
          </div>

          <div className="ml-0 sm:ml-8">
            <h1 className="mb-[2rem] text-[1.9rem]">NFT Details</h1>
            <div className="flex flex-col rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-[1.5rem] text-white md:grid-cols-2">
              <div className="flex flex-row justify-between">
                <span>NFT Name</span>
                <span>{name}</span>
              </div>
              <div className="mt-[2rem] flex flex-row justify-between">
                <span className="mr-16">Collection</span>
                <span>{currentCollection.name}</span>
              </div>
              <div className="mt-[2rem] flex flex-row justify-between">
                <span className="mr-16">Floor Price</span>
                <span className="flex items-center">
                  {formatFloorPrice()}{' '}
                  <Image
                    className="ml-2 mr-4 inline h-[1.5rem] w-[1.5rem] xl:h-[1.8rem] xl:w-[1.8rem]"
                    src="/images/svgs/sol-symbol.svg"
                    alt="SOL Symbol"
                    width={0}
                    height={0}
                    unoptimized
                  />
                  {formatFloorPriceUsd()}
                </span>
              </div>
            </div>
            {/* TODO need to reload currentNft */}
            {currentNft?.attributes_array?.length > 0 && (
              <h1 className="mb-[2rem] mt-[2rem] text-[2rem]">Attributes</h1>
            )}
            <div className="grid grid-cols-2 gap-x-[2rem] gap-y-[2rem] sm:grid-cols-3 sm:gap-x-[1.3rem] sm:gap-y-[1.5rem] xl:grid-cols-3">
              {currentNft.attributes_array?.map((attr, i) => (
                <Attribute key={i} attribute={attr} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default Nft
