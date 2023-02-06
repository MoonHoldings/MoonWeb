import React from 'react'

const NFTCard = () => {
  return (
    <div className="h-[24.952rem] rounded-[1rem] border-2 border-[#62EAD2] p-[1rem] text-white">
      <img
        className="mb-[1rem] h-[14.75rem] w-[14.75rem] rounded-[1rem] object-cover"
        src="/images/dummy-img.jpg"
        alt="NFT picture"
      />
      <div className="details flex flex-col justify-between">
        <h1 className="text-[1.2rem] font-bold">DeGods</h1>
        <h2 className="text-[1.2rem] font-semibold text-[#62EAD2]">
          100 ITEMS
        </h2>
        <div className="flex items-center text-[1.2rem] font-semibold">
          <div>48,200</div>
          <img
            className="ml-2 inline"
            src="/images/svgs/sol-symbol.svg"
            alt="SOL Symbol"
          />
        </div>
        <div className="text-[1.2rem]">$482,000</div>
      </div>
    </div>
  )
}

export default NFTCard
