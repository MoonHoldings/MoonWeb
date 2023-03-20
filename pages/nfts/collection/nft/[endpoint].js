import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import decrypt from 'utils/decrypt'

import { populateCurrentNft } from 'redux/reducers/walletSlice'
import SidebarsLayout from 'components/nft/SidebarsLayout'
import Attribute from 'components/partials/AttributeBox'

const Nft = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { currentNft, currentCollection } = useSelector((state) => state.wallet)

  const image = currentNft.image_uri

  const name = currentNft.name?.length ? currentNft.name : currentNft.symbol

  const handleClick = (url) => router.push(`/${url}`)

  useEffect(() => {
    const restoreNFT = () => {
      const encryptedText = localStorage.getItem('walletState')
      const decryptedObj = decrypt(encryptedText)

      if (decryptedObj.currentNft) {
        dispatch(populateCurrentNft(decryptedObj.currentNft))
      } else {
        router.push('/nfts/collection')
      }
    }

    restoreNFT()
  }, [dispatch, router])

  return (
    <SidebarsLayout>
      <div className="py-[2rem] md:order-2">
        <div className="flex items-center px-[1rem] text-center">
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
              <div className="mb-[2rem] flex flex-row justify-between">
                <span>NFT Name</span>
                <span>{name}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>Collection</span>
                <span>{currentCollection.name}</span>
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
