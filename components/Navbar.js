import React from 'react'
import { MOON_HOLDINGS } from 'app/constants/copy'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-[4.6rem] items-center items-center justify-between border-b border-gray-800 bg-black px-[2rem]">
      <Link href="#" className="flex items-center">
        <img
          className="mr-[0.7rem] h-[2.6rem] w-[2.6rem]"
          src="/images/svgs/moon-holdings-logo-white.svg"
          alt=""
        />
        <div className="font-poppins text-[1.8rem] font-bold">
          {MOON_HOLDINGS}
        </div>
      </Link>

      <button>
        <img
          className="h-[3rem]"
          src="/images/svgs/icon-hamburger-menu.svg"
          alt="Hamburger menu"
        />
      </button>
    </div>
  )
}

export default Navbar
