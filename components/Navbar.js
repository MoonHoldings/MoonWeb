import React from 'react'
import { MOON_HOLDINGS } from 'app/constants/copy'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="flex h-[4.6rem] items-center items-center justify-between border-b border-gray-800 px-[2rem] dark:bg-black">
      <Link href="#" className="flex items-center">
        <img
          className="mr-[0.7rem] h-[3rem] w-[3rem]"
          src="/images/svgs/moon-holdings-logo-white.svg"
          alt=""
        />
        <div className="font-poppins text-[1.6rem] font-bold">
          {MOON_HOLDINGS}
        </div>
      </Link>

      <button>
        <img src="/images/svgs/icon-hamburger-menu.svg" alt="hamburger-menu" />
      </button>
    </div>
  )
}

export default Navbar
