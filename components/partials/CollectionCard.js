import { useRouter } from 'next/router'
import React from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { insertCurrentCollection } from 'redux/reducers/walletSlice'

const CollectionCard = ({ collection }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const collectionClick = () => {
    const redirect = () => {
      router.push('/nfts/collection')
    }

    if (collection.nfts)
      dispatch(insertCurrentCollection({ collection, redirect }))
  }
  return (
    // removed xl:w-[23.8rem] xl:p-[1.5rem]
    <div
      onClick={collectionClick}
      className="cursor flex min-h-min flex-col rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white active:border-[#62EAD2]  xl:hover:border-[#62EAD2]"
    >
      {collection.name === 'unknown' ? (
        <Image
          // className="mb-[1rem] h-[14.75rem] w-full rounded-[1rem] object-cover xl:mb-[1.5rem] xl:h-[20.08rem]"
          className="mb-[1rem] h-4/5 w-full rounded-[1rem] object-cover p-1 xl:mb-[1.5rem]"
          src="/images/unknown-collections.png"
          alt="NFT picture"
          width={0}
          height={0}
          unoptimized
        />
      ) : (
        <Image
          // className="mb-[1rem] h-[14.75rem] w-full rounded-[1rem] object-cover xl:mb-[1.5rem] xl:h-[20.08rem]"
          className="mb-[1.5rem] h-4/5 w-full rounded-[1rem] object-cover p-1"
          src={collection.image}
          alt="NFT picture"
          width={0}
          height={0}
          unoptimized
        />
      )}

      <div className="details">
        <div className="xl:mb-[1.2rem] xl:flex xl:justify-between">
          <h1 className="mb-[0.4rem] text-[1.2rem] font-bold leading-[1.5rem] sm:text-[2rem] xl:mb-0 xl:text-[1.25rem] 2xl:text-[1.5rem]">
            {collection.name}
          </h1>
          <h2 className="mb-[0.4rem] text-[1.2rem] font-semibold leading-[1.5rem] text-[#62EAD2] xl:mb-0 xl:text-[1.2rem]">
            {collection.nfts.length === 1
              ? collection.nfts.length + ' ITEM'
              : collection.nfts.length + ' ITEMS'}
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
