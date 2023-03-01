import { useRouter } from 'next/router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { insertCurrentCollection } from 'redux/reducers/walletSlice'

const CollectionCard = ({ collection }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { addingNftImageStatus } = useSelector((state) => state.wallet)

  const collectionClick = () => {
    console.log('collection', collection)
    if (collection.nfts) dispatch(insertCurrentCollection(collection))

    // if (addingNftImageStatus === 'successful') {
    router.push('/collection')
    // }
  }
  return (
    <div
      onClick={collectionClick}
      className="cursor rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white active:border-[#62EAD2] xl:w-[23.8rem] xl:p-[1.5rem] xl:hover:border-[#62EAD2]"
    >
      {collection.name === 'unknown' ? (
        <img
          className="mb-[1rem] h-[14.75rem] w-full rounded-[1rem] object-cover xl:mb-[1.5rem] xl:h-[20.08rem]"
          src="/images/unknown-collections.png"
          alt="NFT picture"
        />
      ) : (
        <img
          className="mb-[1rem] h-[14.75rem] w-full rounded-[1rem] object-cover xl:mb-[1.5rem] xl:h-[20.08rem]"
          src={collection.image}
          alt="NFT picture"
        />
      )}

      <div className="details">
        <div className="xl:mb-[1.2rem] xl:flex xl:justify-between">
          <h1 className="mb-[0.4rem] text-[1.2rem] font-bold leading-[1.5rem] xl:mb-0 xl:text-[1.4rem]">
            {collection.name}
          </h1>
          <h2 className="mb-[0.4rem] text-[1.2rem] font-semibold leading-[1.5rem] text-[#62EAD2] xl:mb-0">
            {collection.nft_count} ITEMS
          </h2>
        </div>

        {/* <div className="xl:flex xl:justify-between">
          <div className="mb-[0.4rem] flex items-center text-[1.2rem] font-semibold leading-[1.5rem] xl:mb-0 xl:text-[1.8rem]">
            <div className="">48,200</div>
            <img
              className="ml-2 inline xl:h-[2rem] xl:w-[2rem]"
              src="/images/svgs/sol-symbol.svg"
              alt="SOL Symbol"
            />
          </div>
          <div className="mb-[0.4rem] text-[1.2rem] xl:mb-0 xl:text-[1.8rem] xl:font-light xl:leading-[1.5rem]">
            $482,000
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default CollectionCard
