import React from 'react'
import { useRouter } from 'next/router'
import SidebarsLayout from 'components/nft/SidebarsLayout'

const nft = () => {
  const router = useRouter()
  // const { pid } = router.query
  // console.log('pid', pid)

  return (
    <SidebarsLayout>
      <div className="md:order-2">
        <h1 className="text-[2.9rem]">
          <span
            onClick={() => handleClick('nfts')}
            className="cursor text-[#4C4C4C] underline"
          >
            NFT Portfolio &gt;
          </span>{' '}
          <span
            onClick={() => handleClick('nfts')}
            className="cursor text-[#4C4C4C] underline"
          >
            Collection Name &gt;
          </span>{' '}
          <span>SMB #1142</span>
        </h1>
      </div>
    </SidebarsLayout>
  )
}

export default nft
