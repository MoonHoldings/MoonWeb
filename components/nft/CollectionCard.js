import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Tooltip } from 'antd'

import {
  populateCurrentCollection,
} from 'redux/reducers/nftSlice'


import toCurrencyFormat from 'utils/toCurrencyFormat'
import toShortCurrencyFormat from 'utils/toShortCurrencyFormat'
import isShortCurrencyFormat from 'utils/isShortCurrencyFormat'
import TextBlink from 'components/partials/TextBlink'
import shrinkAddress from 'utils/shrinkAddress'
import { useWallet } from '@solana/wallet-adapter-react'

const CollectionCard = ({ collection, index }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { solUsdPrice } = useSelector((state) => state.crypto)

  const shouldRenderFloorPrice = collection.floorPrice && collection.nfts
  const { publicKey } = useWallet()

  const formatFloorPrice = () => {
    return toCurrencyFormat(
      (parseFloat(collection.floorPrice) / LAMPORTS_PER_SOL) *
        collection.nfts.length
    )
  }

  const formatShortFloorPrice = () => {
    return toShortCurrencyFormat(
      (parseFloat(collection.floorPrice) / LAMPORTS_PER_SOL) *
        collection.nfts.length
    )
  }

  const formatFloorPriceUSD = () => {
    return `$${toCurrencyFormat(
      (parseFloat(collection.floorPrice) / LAMPORTS_PER_SOL) *
        collection.nfts.length *
        solUsdPrice
    )}`
  }

  const formatShortFloorPriceUSD = () => {
    return `$${toShortCurrencyFormat(
      (parseFloat(collection.floorPrice) / LAMPORTS_PER_SOL) *
        collection.nfts.length *
        solUsdPrice
    )}`
  }

  const collectionClick = async () => {
    if (collection.nfts) {
      dispatch(
        populateCurrentCollection({
          collection: collection,
          publicKey: publicKey ? publicKey.toBase58() : '',
        })
      )
      router.push('/nfts/collection')
    }
  }

  const renderFloorPrice = () => {
    return (
      <>
        {formatShortFloorPrice()}
        <Image
          className="ml-2 inline h-[1.5rem] w-[1.5rem] xl:h-[2rem] xl:w-[2rem]"
          src="/images/svgs/sol-symbol.svg"
          alt="SOL Symbol"
          width={0}
          height={0}
          unoptimized
        />
      </>
    )
  }

  return (
    <div
      onClick={collectionClick}
      className="cursor flex min-h-min flex-col rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white active:border-[#62EAD2] xl:hover:border-[#62EAD2]"
    >
      {collection.name === 'unknown' ? (
        <Image
          className="mb-[1rem] h-[20rem] w-full rounded-[1rem] object-cover p-1 xl:mb-[1.5rem]"
          src="/images/unknown-collections.png"
          alt="NFT picture"
          width={0}
          height={0}
          unoptimized
        />
      ) : (
        <Image
          className="mb-[1.5rem] h-[20rem] w-full rounded-[1rem] object-cover p-1"
          src={collection.image}
          alt="NFT picture"
          width={0}
          height={0}
          unoptimized
        />
      )}

      <div className="details">
        <div className="xl:mb-[1.2rem] xl:flex xl:justify-between">
          <h1 className="mb-[0.4rem] mr-12 break-all text-[1.2rem] font-bold leading-[1.5rem] sm:text-[2rem] xl:mb-0 xl:text-[1.25rem] 2xl:text-[1.5rem]">
            {shrinkAddress(collection.name)}
          </h1>
          {collection.nfts && (
            <h2 className="mb-[0.4rem] text-[1.2rem] font-semibold leading-[1.5rem] text-[#62EAD2] xl:mb-0 xl:text-[1.2rem]">
              {collection.nfts.length === 1
                ? collection.nfts.length + ' ITEM'
                : collection.nfts.length + ' ITEMS'}
            </h2>
          )}
        </div>
        {shouldRenderFloorPrice && (
          <div className="items-center xl:flex xl:justify-between">
            <Tooltip
              color="#1F2126"
              title={
                <span className="text-[1.5rem]">{formatFloorPrice()}</span>
              }
              trigger={
                isShortCurrencyFormat(formatShortFloorPrice()) ? 'hover' : null
              }
            >
              <div className="mb-[0.4rem] flex items-center text-[1.3rem] font-semibold leading-[1.5rem] xl:mb-0 xl:text-[1.8rem]">
                {renderFloorPrice()}
              </div>
            </Tooltip>

            {solUsdPrice && (
              <Tooltip
                color="#1F2126"
                title={
                  <span className="text-[1.6rem]">{formatFloorPriceUSD()}</span>
                }
                trigger={
                  isShortCurrencyFormat(formatShortFloorPriceUSD())
                    ? 'hover'
                    : null
                }
              >
                <div>
                  <TextBlink
                    text={formatShortFloorPriceUSD()}
                    className="mb-[0.4rem] text-[1.3rem] xl:mb-0 xl:text-[1.8rem] xl:font-light xl:leading-[1.8rem]"
                  />
                </div>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionCard
