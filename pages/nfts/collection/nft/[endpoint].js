import React from 'react'
import SidebarsLayout from 'components/nft/SidebarsLayout'
import Attribute from 'components/partials/AttributeBox'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const Nft = () => {
  const router = useRouter()
  const { currentNft, currentCollection } = useSelector((state) => state.wallet)
  console.log('currentNft', currentNft)
  console.log('currentCollection', currentCollection)
  // const { endpoint } = router.query
  // console.log('pid', pid)
  const handleClick = (url) => {
    router.push(`/${url}`)
  }

  return (
    <SidebarsLayout>
      <div className="md:order-2">
        <h1 className="text-[2.9rem]">
          <span
            onClick={() => handleClick('nfts')}
            className="cursor text-[#4C4C4C] underline"
          >
            NFT Portfolio &gt;
          </span>{' '}
          <span
            onClick={() => handleClick('nfts/collection')} // TODO < need to dynamically load previous collection
            className="cursor text-[#4C4C4C] underline"
          >
            {currentCollection.name} &gt;
          </span>{' '}
          <span>{currentNft.name}</span>
        </h1>

        <div className="nft-cards mt-[2rem] grid grid-cols-2 gap-x-[2rem] gap-y-[2rem] md:grid-cols-2 md:gap-x-[1.3rem] md:gap-y-[1.5rem] xl:grid-cols-2">
          <div className="cursor rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white">
            <img
              className="mb-[1rem] h-full w-full rounded-[1rem] object-cover xl:mb-[1.5rem]"
              src={currentNft.image}
              alt="NFT picture"
            />
          </div>

          <div>
            <h1 className="mb-[2rem] text-[2rem]">NFT Details</h1>
            <div className="flex flex-col rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-[1.5rem] text-white md:grid-cols-2">
              <div className="mb-[2rem] flex flex-row justify-between">
                <span>NFT Name</span>
                <span>{currentNft.name}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Collection</span>
                <span>{currentCollection.name}</span>
              </div>
            </div>
            {/* TODO need to reload currentNft */}
            {currentNft &&
            currentNft.attributes &&
            currentNft.attributes.length > 0 ? (
              <h1 className="mb-[2rem] mt-[2rem] text-[2rem]">Attributes</h1>
            ) : (
              ''
            )}
            <div className="grid grid-cols-2 gap-x-[2rem] gap-y-[2rem] sm:grid-cols-3 sm:gap-x-[1.3rem] sm:gap-y-[1.5rem] xl:grid-cols-3">
              {currentNft.attributes?.map((attr, i) => (
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
