import React from 'react'
import { MOON_HOLDINGS } from 'app/constants/copy'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import {
  changeLeftSideBarOpen,
  changeRightSideBarOpen,
} from 'redux/reducers/utilSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const clickHamburgerMenu = () => {
    dispatch(changeLeftSideBarOpen(true))
  }
  const clickWallet = () => {
    dispatch(changeRightSideBarOpen(true))
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-[4.6rem] items-center justify-between border-b border-gray-800 bg-black px-[2rem] md:hidden">
      <Link
        href="/"
        className="flex items-center"
        style={{ order: router.pathname === '/nft' && '2' }}
      >
        {router.pathname === '/nft' ? (
          <div className="mr-3 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full bg-white">
            <img
              className="h-[1.3rem] w-[1.3rem]"
              src="/images/svgs/moon-holdings-logo-black.svg"
              alt=""
            />
          </div>
        ) : (
          <img
            className="mr-[0.7rem] h-[2.6rem] w-[2.6rem]"
            src="/images/svgs/moon-holdings-logo-white.svg"
            alt=""
          />
        )}

        <div className="font-poppins text-[1.6rem] font-bold text-white">
          {MOON_HOLDINGS}
        </div>
      </Link>

      <button
        onClick={clickHamburgerMenu}
        style={{ order: router.pathname === '/nft' && '1' }}
      >
        <img
          className="h-[2rem]"
          src="/images/svgs/hamburger-menu-white.svg"
          alt="Hamburger menu"
        />
      </button>

      {router.pathname === '/nft' && (
        <button
          onClick={clickWallet}
          style={{ order: router.pathname === '/nft' && '3' }}
        >
          <img
            className="h-[2rem]"
            src="/images/svgs/wallet-white.svg"
            alt="Wallet"
          />
        </button>
      )}
    </div>
  )
}

export default Navbar