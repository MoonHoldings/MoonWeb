import React from 'react'

const NFTCard = () => {
  return (
    <div className="rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white active:border-[#62EAD2] lg:w-[23.8rem] lg:p-[1.5rem] lg:hover:border-[#62EAD2]">
      <img
        className="mb-[1rem] h-[14.75rem] w-full rounded-[1rem] object-cover lg:mb-[1.5rem] lg:h-[20.08rem]"
        src="/images/dummy-img.jpg"
        alt="NFT picture"
      />
      <div className="details">
        <div className="lg:mb-[1.2rem] lg:flex lg:justify-between">
          <h1 className="mb-[0.4rem] text-[1.2rem] font-bold leading-[1.5rem] lg:mb-0 lg:text-[1.4rem]">
            DeGods
          </h1>
          <h2 className="mb-[0.4rem] text-[1.2rem] font-semibold leading-[1.5rem] text-[#62EAD2] lg:mb-0">
            100 ITEMS
          </h2>
        </div>

        <div className="lg:flex lg:justify-between">
          <div className="mb-[0.4rem] flex items-center text-[1.2rem] font-semibold leading-[1.5rem] lg:mb-0 lg:text-[1.8rem]">
            <div className="">48,200</div>
            <img
              className="ml-2 inline lg:h-[2rem] lg:w-[2rem]"
              src="/images/svgs/sol-symbol.svg"
              alt="SOL Symbol"
            />
          </div>
          <div className="mb-[0.4rem] text-[1.2rem] lg:mb-0 lg:text-[1.8rem] lg:font-light lg:leading-[1.5rem]">
            $482,000
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTCard
