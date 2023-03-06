import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { populateCurrentNft } from 'redux/reducers/walletSlice'
import endpointMaker from 'utils/endpointMaker'

const NFT = ({ nft }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const nftClick = () => {
    dispatch(populateCurrentNft(nft))

    // const endpoint = endpointMaker(nft.name)
    router.push(
      '/nfts/collection/nft/[endpoint]',
      `/nfts/collection/nft/${nft.update_authority}`
    )
  }
  return (
    <div
      onClick={nftClick}
      className="cursor rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white active:border-[#62EAD2] xl:w-[23.8rem] xl:p-[1.5rem] xl:hover:border-[#62EAD2]"
    >
      <img
        className="mb-[1rem] h-[14.75rem] w-full rounded-[1rem] object-cover xl:mb-[1.5rem] xl:h-[20.08rem]"
        src={nft.image}
        alt="NFT picture"
      />
      <div className="details">
        <div className="xl:mb-[1.2rem] xl:flex xl:justify-between">
          <h1 className="mb-[0.4rem] text-[1.2rem] font-bold leading-[1.5rem] xl:mb-0 xl:text-[1.4rem]">
            {nft.name}
          </h1>
          {/* <h2 className="mb-[0.4rem] text-[1.2rem] font-semibold leading-[1.5rem] text-[#62EAD2] xl:mb-0">
            Listed
          </h2> */}
        </div>

        {/* <div className="xl:flex xl:justify-between">
          <div className="mb-[0.4rem] flex items-center text-[1.2rem] font-semibold leading-[1.5rem] xl:mb-0 xl:text-[1.8rem]">
            <div className="">48,200</div>
            <img
              className="ml-2 inline xl:h-[2rem] xl:w-[2rem]"
              src="/images/svgs/sol-symbol.svg"
              alt="SOL Symbol"
            />
          </div>
          <div className="mb-[0.4rem] text-[1.2rem] xl:mb-0 xl:text-[1.8rem] xl:font-light xl:leading-[1.5rem]">
            $482,000
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default NFT
