import React from 'react'
import CollectionCard from './CollectionCard'
import { NFT_PORTFOLIO } from 'application/constants/copy'

const Collections = ({ collections }) => {
  const totalNftCount = collections?.reduce(
    (total, col) => total + col.nfts?.length,
    0
  )

  const sortedCollections = [...collections]?.sort(
    (a, b) => b?.floorPrice * b?.nfts?.length - a?.floorPrice * a?.nfts?.length
  )

  return (
    <div className="nft-portfolio mt-[2rem] text-white md:order-2">
      <h1 className="text-[2.9rem]">{NFT_PORTFOLIO}</h1>
      <p className=" text-[1.6rem]">
        You have <u>{collections?.length}</u> collections containing{' '}
        <u>{totalNftCount}</u> NFTs
      </p>

      <div className="h grid grid-cols-2 gap-6 py-[2rem] xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 4xl:grid-cols-8">
        {sortedCollections?.map((col, index) => (
          <CollectionCard key={index} index={index} collection={col} />
        ))}
      </div>
    </div>
  )
}

export default Collections
