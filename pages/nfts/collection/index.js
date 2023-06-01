import NFTCard from 'components/nft/NFTCard'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import TextBlink from 'components/partials/TextBlink'
import { Tooltip } from 'antd'
import isShortCurrencyFormat from 'utils/isShortCurrencyFormat'
import toShortCurrencyFormat from 'utils/toShortCurrencyFormat'
import shrinkAddress from 'utils/shrinkAddress'
import CandlestickChart from 'components/Chart'
import { fetchHelloMoonCollectionIds } from 'redux/reducers/nftSlice'

const Index = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { currentCollection, candleStickData, loading } = useSelector(
    (state) => state.nft
  )
  const { solUsdPrice } = useSelector((state) => state.crypto)

  useEffect(() => {
    dispatch(
      fetchHelloMoonCollectionIds({ mint: currentCollection.nfts[0].mint })
    )
  }, [dispatch])

  const handleClick = (url) => {
    router.push(`/${url}`)
  }

  const formatFloorPrice = () => {
    return toCurrencyFormat(
      parseFloat(currentCollection.floorPrice) / LAMPORTS_PER_SOL
    )
  }

  const formatFloorPriceUsd = () => {
    return `$${toCurrencyFormat(
      (parseFloat(currentCollection.floorPrice) / LAMPORTS_PER_SOL) *
        solUsdPrice
    )}`
  }

  const formatShortFloorPriceUsd = () => {
    return `$${toShortCurrencyFormat(
      (parseFloat(currentCollection.floorPrice) / LAMPORTS_PER_SOL) *
        solUsdPrice
    )}`
  }

  const formatFloorPriceTotal = () => {
    return toCurrencyFormat(
      (parseFloat(currentCollection.floorPrice) / LAMPORTS_PER_SOL) *
        currentCollection?.nfts?.length
    )
  }

  const formatFloorPriceUsdTotal = () => {
    return `$${toCurrencyFormat(
      (parseFloat(currentCollection.floorPrice) / LAMPORTS_PER_SOL) *
        solUsdPrice *
        currentCollection?.nfts?.length
    )}`
  }

  const formatShortFloorPriceUsdTotal = () => {
    return `$${toShortCurrencyFormat(
      (parseFloat(currentCollection.floorPrice) / LAMPORTS_PER_SOL) *
        solUsdPrice *
        currentCollection?.nfts?.length
    )}`
  }

  return (
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
          <span className="ml-4">{shrinkAddress(currentCollection.name)}</span>
        </div>
      </div>
      <p className="text-[1.6rem]">
        You have <span>{currentCollection?.nfts?.length}</span>{' '}
        {shrinkAddress(currentCollection.name)} NFTs
      </p>
      <div>
        {candleStickData.length > 0 ? (
          <CandlestickChart candleStickData={candleStickData} />
        ) : loading ? (
          <div className="flex flex-row justify-center">
            <svg
              aria-hidden="true"
              className="mr-2 h-14 w-14 animate-spin fill-teal-400 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <div className="cursor mb-8 mr-4 mt-10 text-center text-[2rem]">
            Chart is not Available
          </div>
        )}
      </div>
      {currentCollection.floorPrice && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bold flex items-center text-center text-[1.5rem] md:text-[2rem]">
              Floor Price:
              <div className="ml-2 flex items-center md:ml-4">
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
              color="#1F2126"
              title={
                <span className="flex h-full items-center text-[1.5rem] md:text-[2rem]">
                  {formatFloorPriceUsd()}
                </span>
              }
              trigger={
                isShortCurrencyFormat(formatShortFloorPriceUsd())
                  ? 'hover'
                  : null
              }
            >
              <div>
                <TextBlink
                  className="bold ml-4 text-[1.5rem] md:text-[2rem]"
                  text={formatShortFloorPriceUsd()}
                />
              </div>
            </Tooltip>
          </div>

          <div className="flex items-center">
            <div className="bold flex items-center text-center text-[1.5rem] md:text-[2rem]">
              Total Value:
              <div className="ml-2 flex items-center md:ml-4">
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
              color="#1F2126"
              title={
                <span className="flex h-full items-center text-[1.5rem] md:text-[2rem]">
                  {formatFloorPriceUsdTotal()}
                </span>
              }
              trigger={
                isShortCurrencyFormat(formatShortFloorPriceUsdTotal())
                  ? 'hover'
                  : null
              }
            >
              <div>
                <TextBlink
                  className="bold ml-4 text-[1.5rem] md:text-[2rem]"
                  text={formatShortFloorPriceUsdTotal()}
                />
              </div>
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
  )
}

export default Index
