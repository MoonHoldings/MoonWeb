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
        <Image
          src="/images/svgs/sharky.svg"
          alt=""
          width="0"
          height="0"
          className="w-[8rem] md:w-[12rem]"
        />
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
              'md:text-[1.4rem]',
              'text-[1.2rem]',
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
              'md:text-[1.4rem]',
              'text-[1.2rem]',
              'text-white',
              'focus:outline-none',
              isBorrow && 'bg-[#3C434B]'
            )}
          >
            Borrow
          </Link>
        </div>
        <Link
          href="lend/history"
          className={mergeClasses(
            'inline-flex',
            'items-center',
            'justify-center',
            'rounded-xl',
            'border',
            'border-transparent',
            'py-3.5',
            'px-5',
            'md:text-[1.4rem]',
            'text-[1.2rem]',
            'text-white',
            'focus:outline-none',
            'bg-[#25282C]',
            'mr-6'
          )}
        >
          View History
        </Link>
      </div>
      <h1 className="text-[3rem]">{title}</h1>
      <p className="text-[1.6rem] opacity-60">{description}</p>
    </>
  )
}

export default Header
