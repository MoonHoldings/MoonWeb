import SidebarsLayout from 'components/nft/SidebarsLayout'
import NFTCard from 'components/partials/NFTCard'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { populateCurrentCollection } from 'redux/reducers/walletSlice'
import decrypt from 'utils/decrypt'

const Index = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { currentCollection } = useSelector((state) => state.wallet)

  const handleClick = (url) => {
    router.push(`/${url}`)
  }

  useEffect(() => {
    const restoreCurrentCollection = () => {
      const encryptedText = localStorage.getItem('walletState')
      const decryptedObj = decrypt(encryptedText)

      if (decryptedObj.currentCollection) {
        dispatch(populateCurrentCollection(decryptedObj.currentCollection))
      } else {
        router.push('/nfts')
      }
    }
    restoreCurrentCollection()
  }, [dispatch, router])

  return (
    <SidebarsLayout>
      <div className="mt-[2rem] text-white md:order-2">
        <div className="flex items-center">
          <div
            onClick={() => handleClick('nfts')}
            className="cursor mr-4 text-[2rem] underline"
          >
            NFT Portfolio
          </div>
          <div className="text-[2.9rem]">
            &gt;
            <span className="ml-4">{currentCollection.name}</span>
          </div>
        </div>
        <p className="text-[1.6rem]">
          You have <span>{currentCollection.nft_count}</span>{' '}
          {currentCollection.name} NFTs
        </p>
        <div className="nft-cards mt-[2rem] grid grid-cols-2 gap-x-[2rem] gap-y-[2rem] sm:grid-cols-3 sm:gap-x-[1.3rem] sm:gap-y-[1.5rem] xl:grid-cols-3">
          {/* {[1, 2, 3, 4, 5].map((card) => (
    <CollectionCard key={card} />
  ))} */}
          {currentCollection.nfts?.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default Index
