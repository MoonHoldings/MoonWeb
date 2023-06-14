import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { populateCurrentNft, selectNft } from 'redux/reducers/nftSlice'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import LazyLoad from 'react-lazy-load'
import { notification } from 'antd'
import { displayNotifModal } from 'utils/notificationModal'

const NFT = ({ nft, floorPrice, selectedNfts, ownedNfts }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [api, contextHolder] = notification.useNotification()

  const image = nft.image
  const name = nft?.name || nft?.symbol

  const nftClick = () => {
    dispatch(populateCurrentNft(nft))

    router.push(
      '/nfts/collection/nft/[endpoint]',
      `/nfts/collection/nft/${nft.mint}`
    )
  }

  const selectNFT = () => {
    if (ownedNfts?.findIndex((item) => item === nft.mint) > -1)
      dispatch(
        selectNft({
          mint: nft.mint,
          name: nft.name,
          notification: notification,
        })
      )
  }

  const formatFloorPrice = () => {
    return (
      parseFloat(floorPrice.floorPriceLamports) / LAMPORTS_PER_SOL
    ).toLocaleString()
  }

  return (
    <div
      onClick={selectNFT}
      className={`${
        selectedNfts?.findIndex((item) => item.mint === nft.mint) !== -1 &&
        selectedNfts != null
          ? 'border-[#62EAD2]'
          : ''
      } ${
        ownedNfts?.findIndex((item) => item === nft.mint) > -1 &&
        ownedNfts != null
          ? ' cursor xl:hover:border-[#62EAD2]'
          : ''
      } flex min-h-min flex-col rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white `}
    >
      <LazyLoad threshold={0.95}>
        <Image
          className="mb-[1rem] h-[14.75rem] w-full rounded-[1rem] object-cover xl:mb-[1.5rem] xl:h-[20.08rem]"
          src={image}
          alt="NFT picture"
          width={0}
          height={0}
          unoptimized
        />
      </LazyLoad>

      <div>
        <div className="xl:mb-[1.2rem] xl:flex xl:justify-between">
          {name ? (
            <h1 className="mb-[0.4rem] text-[1.2rem] font-bold leading-[1.5rem] xl:mb-0 xl:text-[1.4rem]">
              {name}
            </h1>
          ) : (
            <div className="mb-[0.4rem]" />
          )}
          {ownedNfts?.findIndex((item) => item === nft.mint) > -1 &&
          ownedNfts != null ? (
            <h1 className=" text-[.5rem] font-bold leading-[1.5rem] xl:mb-0 xl:text-[1rem]">
              Connected
            </h1>
          ) : (
            <></>
          )}
        </div>

        {/* <div className="items-center xl:flex xl:justify-between">
          {floorPrice && (
            <div className="mb-[0.4rem] flex items-center text-[1.2rem] font-semibold leading-[1.5rem] xl:mb-0 xl:text-[1.8rem]">
              <div className="">{formatFloorPrice()}</div>
              <Image
                className="ml-2 inline h-[1.5rem] w-[1.5rem] xl:h-[2rem] xl:w-[2rem]"
                src="/images/svgs/sol-symbol.svg"
                alt="SOL Symbol"
                width={0}
                height={0}
                unoptimized
              />
            </div>
          )} 
         <div className="mb-[0.4rem] text-[1.2rem] xl:mb-0 xl:text-[1.8rem] xl:font-light xl:leading-[1.5rem]">
            $482,000
          </div> 
        </div> */}

        <hr className="mb-[0.4rem] h-[0.2rem] w-full rounded border-0 bg-[#A6A6A6] xl:mb-[2rem]" />
        {contextHolder}
        <h1
          onClick={(e) => {
            e.stopPropagation() // Stop the event from propagating to the parent div
            nftClick()
          }}
          className="cursor mb-[0.4rem] text-center text-[1.2rem] font-bold leading-[1.5rem] text-[#62EAD2] underline xl:text-[1.4rem]"
        >
          Details
        </h1>
      </div>
    </div>
  )
}

export default NFT
