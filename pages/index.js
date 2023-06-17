import React, { useEffect } from 'react'

import { GeneralButton } from 'components/forms/GeneralButton'
import Image from 'next/image'
import { MOON_HOLDINGS } from 'application/constants/copy'
import Router from 'next/router'
import withAuth from 'hoc/withAuth'

const Index = (props) => {
  const loginInstead = () => {
    Router.push('/login')
  }

  const signupInstead = () => {
    Router.push('/signup')
  }

  return (
    <div className="flex h-screen w-full flex-col pt-8">
      <div className="flex justify-center md:mx-8 md:justify-between">
        <div className="flex hidden items-center self-start hover:cursor-pointer md:block lg:block lg:flex">
          <div className="flex h-[2.3rem] w-[2.3rem] items-center justify-center xl:h-[4rem] xl:w-[4rem]">
            <Image
              className="h-[1.8Rem] w-[1.8Rem] xl:h-[3rem] xl:w-[3rem]"
              src="/images/svgs/moon-holdings-logo-white.svg"
              width={40}
              height={40}
              alt=""
            />
          </div>
          <div className="text-[1.6rem] font-semibold text-[#FFFFFF] xl:text-[1.8rem] xl:font-semibold ">
            {MOON_HOLDINGS}
          </div>
        </div>
        {!props.isLoggedIn && (
          <div className={'flex flex-row'}>
            <div className={'mr-4 w-[12.2rem]'}>
              <GeneralButton
                onClick={signupInstead}
                title={'Signup'}
                bgColor={
                  'bg-gradient-to-b from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400'
                }
              />
            </div>
            <div className={'ml-4 w-[12.2rem] '}>
              <GeneralButton
                hasBorder
                isWhite
                onClick={loginInstead}
                title={'Login'}
                bgColor={'bg-black hover:bg-gray-900'}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto mt-10 flex flex-1 flex-col px-10 md:w-4/5 md:px-60">
        <h1 className="text-[3rem] font-bold">
          Skyrocketing portfolio decision-making
        </h1>
        <h4 className="mt-20 bg-gradient-to-r from-teal-500 to-cyan-300 bg-clip-text text-[6rem] font-bold text-transparent">
          Track.
        </h4>
        <h4 className="bg-gradient-to-r from-teal-500 to-cyan-300 bg-clip-text text-[6rem] font-bold text-transparent">
          Compare.
        </h4>
        <h4 className="bg-gradient-to-r from-teal-500 to-cyan-300 bg-clip-text text-[6rem] font-bold text-transparent">
          Compete.
        </h4>
        <p className="mt-8 pb-4 text-justify text-[1.8rem]">
          MoonHolding's purpose is to make investing engaging, not just for
          current investors but for newcomers alike We believe in utilizing
          atomic habits to make portfolio management obvious, attractive, and
          rewarding.
        </p>
      </div>

      <div className="bottom-0 h-64 justify-center self-center md:w-3/4">
        <Image
          src="/images/gifs/moon-holdings-banner-cropped.gif"
          alt=""
          height={0}
          width={0}
          className="inline-block h-full w-full "
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}

export default withAuth(Index)
