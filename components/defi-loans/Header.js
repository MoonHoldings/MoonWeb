import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import mergeClasses from 'utils/mergeClasses'

const Header = ({ title, description }) => {
  const router = useRouter()

  const isLend = router.pathname.includes('lend')
  const isBorrow = router.pathname.includes('borrow')

  return (
    <>
      <div className="flex items-center justify-between">
        <Image src="/images/svgs/sharky.svg" alt="" width="120" height="120" />
        <div className="rounded-[30px] bg-[#191C20] p-4">
          <Link
            href="lend"
            className={mergeClasses(
              'inline-flex',
              'items-center',
              'justify-center',
              'rounded-[30px]',
              'border',
              'border-transparent',
              'py-1.5',
              'px-4',
              'text-[1.4rem]',
              'text-white',
              'focus:outline-none',
              isLend && 'bg-[#3C434B]'
            )}
          >
            Lend
          </Link>
          <Link
            href="borrow"
            className={mergeClasses(
              'inline-flex',
              'items-center',
              'justify-center',
              'rounded-[30px]',
              'border',
              'border-transparent',
              'py-1.5',
              'px-4',
              'text-[1.4rem]',
              'text-white',
              'focus:outline-none',
              isBorrow && 'bg-[#3C434B]'
            )}
          >
            Borrow
          </Link>
        </div>
        <div className="hidden md:block" />
      </div>
      <h1 className="text-[3rem]">{title}</h1>
      <p className="text-[1.6rem] opacity-60">{description}</p>
    </>
  )
}

export default Header
