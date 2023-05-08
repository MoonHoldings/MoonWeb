import React from 'react'
import { MOON_HOLDINGS } from 'app/constants/copy'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import {
  changeLeftSideBarOpen,
  changeRightSideBarOpen,
  changeLendRightSidebarOpen,
} from 'redux/reducers/utilSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { leftSideBarOpen, rightSideBarOpen, lendRightSideBarOpen } =
    useSelector((state) => state.util)

  const clickHamburgerMenu = () => {
    dispatch(changeLeftSideBarOpen(!leftSideBarOpen))
  }

  const clickWallet = () => {
    console.log('hey')
    if (
      router.pathname.includes('nfts') ||
      router.pathname.includes('crypto')
    ) {
      dispatch(changeRightSideBarOpen(!rightSideBarOpen))
    } else {
      dispatch(changeLendRightSidebarOpen(!lendRightSideBarOpen))
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-[4.6rem] items-center justify-between border-b border-gray-800 bg-black px-[2rem] xl:hidden">
      <Link
        href="/"
        className="flex items-center"
        style={{
          order:
            (router.pathname.includes('/nfts') ||
              router.pathname.includes('defi-loans') ||
              router.pathname.includes('crypto')) &&
            '2',
        }}
      >
        {router.pathname.includes('/nfts') ||
        router.pathname.includes('defi-loans') ||
        router.pathname.includes('crypto') ? (
          <div className="mr-3 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full bg-white">
            <Image
              className="h-[1.3rem] w-[1.3rem]"
              src="/images/svgs/moon-holdings-logo-black.svg"
              alt=""
              width="40"
              height="40"
            />
          </div>
        ) : (
          <Image
            className="mr-[0.7rem] h-[2.6rem] w-[2.6rem]"
            src="/images/svgs/moon-holdings-logo-white.svg"
            width="40"
            height="40"
            alt=""
          />
        )}

        <div className="mobile-top-bar font-poppins text-[1.6rem] font-bold text-white">
          {MOON_HOLDINGS}
        </div>
      </Link>

      <button
        id="btn-hamburger"
        onClick={clickHamburgerMenu}
        style={{
          order:
            (router.pathname.includes('/nfts') ||
              router.pathname.includes('defi-loans') ||
              router.pathname.includes('crypto')) &&
            '1',
        }}
      >
        <Image
          className="h-[2rem]"
          src="/images/svgs/hamburger-menu-white.svg"
          alt="Hamburger menu"
          width="29"
          height="20"
        />
      </button>

      {(router.pathname.includes('/nfts') ||
        router.pathname.includes('/defi-loans') ||
        router.pathname.includes('crypto')) && (
        <button
          id="btn-wallet-mobile"
          onClick={clickWallet}
          style={{
            order:
              (router.pathname.includes('/nfts') ||
                router.pathname.includes('defi-loans') ||
                router.pathname.includes('crypto')) &&
              '3',
          }}
        >
          <Image
            className="h-[2rem]"
            src="/images/svgs/wallet-white.svg"
            width="20"
            height="20"
            alt="Wallet"
          />
        </button>
      )}
    </div>
  )
}

export default Navbar
