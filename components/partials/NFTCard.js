import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { populateCurrentNft } from 'redux/reducers/walletSlice'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import endpointMaker from 'utils/endpointMaker'

const NFT = ({ nft, floorPrice }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const image = nft.image_uri

  const nftClick = () => {
    dispatch(populateCurrentNft(nft))

    // const endpoint = endpointMaker(nft.name)
    router.push(
      '/nfts/collection/nft/[endpoint]',
      `/nfts/collection/nft/${nft.update_authority}`
    )
  }

  const fetchListingDetails = () => {}

  const formatFloorPrice = () => {
    return (
      parseFloat(floorPrice.floorPriceLamports) / LAMPORTS_PER_SOL
    ).toLocaleString()
  }

  return (
    <div
      onClick={nftClick}
      className="cursor flex min-h-min flex-col rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white active:border-[#62EAD2] xl:hover:border-[#62EAD2]"
    >
      <Image
        className="mb-[1rem] h-[14.75rem] w-full rounded-[1rem] object-cover xl:mb-[1.5rem] xl:h-[20.08rem]"
        src={image}
        alt="NFT picture"
        width={0}
        height={0}
        unoptimized
      />
      <div className="details">
        <div className="xl:mb-[1.2rem] xl:flex xl:justify-between">
          {nft.name && (
            <h1 className="mb-[0.4rem] text-[1.2rem] font-bold leading-[1.5rem] xl:mb-0 xl:text-[1.4rem]">
              {nft.name}
            </h1>
          )}
          {/* <h2 className="mb-[0.4rem] text-[1.2rem] font-semibold leading-[1.5rem] text-[#62EAD2] xl:mb-0">
            Listed
          </h2> */}
        </div>

        <div className="items-center xl:flex xl:justify-between">
          {floorPrice && (
            <div className="mb-[0.4rem] flex items-center text-[1.2rem] font-semibold leading-[1.5rem] xl:mb-0 xl:text-[1.8rem]">
              <div className="">{formatFloorPrice()}</div>
              <Image
                className="ml-2 inline xl:h-[2rem] xl:w-[2rem]"
                src="/images/svgs/sol-symbol.svg"
                alt="SOL Symbol"
                width={0}
                height={0}
                unoptimized
              />
            </div>
          )}
          {/* <div className="mb-[0.4rem] text-[1.2rem] xl:mb-0 xl:text-[1.8rem] xl:font-light xl:leading-[1.5rem]">
            $482,000
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default NFT
