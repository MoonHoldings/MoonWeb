import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import axios from 'axios'

import {
  insertCurrentCollection,
  updateCollectionFloorPrice,
} from 'redux/reducers/walletSlice'

import { HELLO_MOON_KEY, HELLO_MOON_URL } from 'app/constants/api'

const CollectionCard = ({ collection, index }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    fetchFloorPrice()
  }, [])

  const fetchFloorPrice = async () => {
    try {
      const { data: nameSearch } = await axios.post(
        `${HELLO_MOON_URL}/nft/collection/name`,
        {
          collectionName: collection.name,
        },
        {
          headers: {
            Authorization: `Bearer ${HELLO_MOON_KEY}`,
          },
        }
      )

      if (nameSearch?.data?.length === 1) {
        const { data: floorPrice } = await axios.post(
          `${HELLO_MOON_URL}/nft/collection/floorprice`,
          {
            helloMoonCollectionId: nameSearch.data[0].helloMoonCollectionId,
          },
          {
            headers: {
              Authorization: `Bearer ${HELLO_MOON_KEY}`,
            },
          }
        )

        if (floorPrice?.data?.length) {
          dispatch(
            updateCollectionFloorPrice({
              index,
              floorPrice: floorPrice?.data[0],
            })
          )
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const formatFloorPrice = () => {
    return (
      (parseFloat(collection.floorPrice.floorPriceLamports) /
        LAMPORTS_PER_SOL) *
      collection.nfts.length
    ).toLocaleString()
  }

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
        {collection.floorPrice && (
          <div className="items-center xl:flex xl:justify-between">
            <div className="mb-[0.4rem] flex items-center text-[1.2rem] font-semibold leading-[1.5rem] xl:mb-0 xl:text-[1.8rem]">
              {formatFloorPrice()}

              <Image
                className="ml-2 inline h-[1.5rem] w-[1.5rem] xl:h-[2rem] xl:w-[2rem]"
                src="/images/svgs/sol-symbol.svg"
                alt="SOL Symbol"
                width={0}
                height={0}
                unoptimized
              />
            </div>
            {/* <div className="mb-[0.4rem] text-[1.2rem] xl:mb-0 xl:text-[1.8rem] xl:font-light xl:leading-[1.5rem]">
            $482,000
          </div> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionCard
