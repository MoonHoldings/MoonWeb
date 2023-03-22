import SidebarsLayout from 'components/nft/SidebarsLayout'
import NFTCard from 'components/partials/NFTCard'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import {
  populateCurrentCollection,
  populateWalletsAndCollections,
} from 'redux/reducers/walletSlice'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

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

  const formatFloorPrice = () => {
    return (
      parseFloat(currentCollection.floorPrice.floorPriceLamports) /
      LAMPORTS_PER_SOL
    ).toLocaleString()
  }

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
        {currentCollection.floorPrice && (
          <div className="mt-8 flex items-center">
            <p className="bold  text-[2rem]">
              Floor Price: {formatFloorPrice()}
            </p>
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
    </SidebarsLayout>
  )
}

export default Index
