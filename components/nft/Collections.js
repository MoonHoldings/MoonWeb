import React from 'react'
import CollectionCard from './CollectionCard'
import { NFT_PORTFOLIO } from 'app/constants/copy'
import LazyLoad from 'react-lazy-load'

const Collections = ({ collections }) => {
  const totalNftCount = collections.reduce(
    (total, col) => total + col.nfts?.length,
    0
  )
  return (
    <div className="nft-portfolio mt-[2rem] text-white md:order-2">
      <h1 className="text-[2.9rem]">{NFT_PORTFOLIO}</h1>
      <p className=" text-[1.6rem]">
        You have <u>{collections.length}</u> collections containing{' '}
        <u>{totalNftCount}</u> NFTs
      </p>

      <div className="h grid grid-cols-2 gap-6 py-[2rem] xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 4xl:grid-cols-8">
        {/* <div className="nft-cards grid grid-cols-2 gap-x-[2rem] gap-y-[2rem] sm:grid-cols-3 sm:gap-x-[1.3rem] sm:gap-y-[1.5rem] xl:grid-cols-3"> */}
        {/* {[1, 2, 3, 4, 5].map((card) => (
    <CollectionCard key={card} />
  ))} */}
        {collections.map((col, index) => (
          <CollectionCard key={index} index={index} collection={col} />
        ))}
      </div>
    </div>
  )
}

export default Collections
