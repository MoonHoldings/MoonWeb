import React from 'react'
import NFTCard from './NFTCard'

const Collections = ({ collections }) => {
  return (
    <div className="nft-portfolio mt-[2rem] text-white md:order-2">
      <h1 className="text-[2.9rem]">NFT Portfolio</h1>
      <p className="mb-[4.8rem] text-[1.6rem]">
        You have <u>20</u> collections containing <u>125</u> NFTs
      </p>
      <div className="nft-cards grid grid-cols-2 gap-x-[2rem] gap-y-[2rem] sm:grid-cols-3 sm:gap-x-[1.3rem] sm:gap-y-[1.5rem] xl:grid-cols-3">
        {/* {[1, 2, 3, 4, 5].map((card) => (
    <NFTCard key={card} />
  ))} */}
        {collections.map((col, index) => (
          <NFTCard key={index} collection={col} />
        ))}
      </div>
    </div>
  )
}

export default Collections
