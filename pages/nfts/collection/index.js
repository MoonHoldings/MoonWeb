import SidebarsLayout from 'components/nft/SidebarsLayout'
import NFTCard from 'components/partials/NFTCard'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  populateCurrentCollection,
  populateWalletsAndCollections,
} from 'redux/reducers/walletSlice'
import decrypt from 'utils/decrypt'

const Index = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { currentCollection, allWallets } = useSelector((state) => state.wallet)

  const handleClick = (url) => {
    router.push(`/${url}`)
  }

  const restoreCurrentCollection = () => {
    const encryptedText = localStorage.getItem('walletState')
    const decryptedObj = decrypt(encryptedText)

    if (decryptedObj.currentCollection) {
      dispatch(populateCurrentCollection(decryptedObj.currentCollection))
    } else {
      router.push('/nfts')
    }
  }

  const restoreWallet = () => {
    const walletStateDecrypted = localStorage.getItem('walletState')
    if (walletStateDecrypted && allWallets.length === 0) {
      const walletState = decrypt(walletStateDecrypted)
      dispatch(
        populateWalletsAndCollections({
          allWallets: walletState.allWallets,
          collections: walletState.collections,
        })
      )
    }
  }

  useEffect(() => {
    restoreCurrentCollection()

    if (router.pathname.includes('collection')) restoreWallet()
  }, [])

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
        <div className="h grid grid-cols-2 gap-6 py-[2rem] xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 4xl:grid-cols-8">
          {currentCollection.nfts?.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default Index
