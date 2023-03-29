import SidebarsLayout from 'components/partials/SidebarsLayout'
import Image from 'next/image'
import React from 'react'

const Lend = () => {
  return (
    <SidebarsLayout>
      <div className="mt-[2rem] md:order-2">
        <div className="flex items-center justify-between">
          <Image
            src="/images/svgs/sharky.svg"
            alt=""
            width="120"
            height="120"
          />
          <div className="rounded-[30px] bg-[#191C20] p-4">
            <button className="inline-flex items-center justify-center rounded-[30px] border border-transparent bg-[#3C434B] py-1.5 px-4 text-[1.4rem] text-white focus:outline-none">
              Lend
            </button>
            <button className="ml-4 inline-flex items-center justify-center rounded-2xl border border-transparent py-1.5 px-4 text-[1.4rem] text-white focus:outline-none">
              Borrow
            </button>
          </div>
          <div />
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default Lend
