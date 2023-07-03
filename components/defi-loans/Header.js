import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLazyQuery } from '@apollo/client'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import mergeClasses from 'utils/mergeClasses'
import { GET_TOTAL_BORROWS, GET_TOTAL_LENDS } from 'utils/queries'
import { Spin } from 'antd'

const Header = ({ title, description }) => {
  const router = useRouter()
  const { publicKey } = useWallet()

  const isLend = router.pathname.includes('lend')
  const isBorrow = router.pathname.includes('borrow')

  const [getTotalLends, { loading: loadingLends, data: lendData }] =
    useLazyQuery(GET_TOTAL_LENDS)
  const [getTotalBorrows, { loading: loadingBorrows, data: borrowData }] =
    useLazyQuery(GET_TOTAL_BORROWS)

  useEffect(() => {
    if (!loadingLends && publicKey && isLend) {
      getTotalLends({
        variables: {
          address: publicKey.toBase58(),
          // address: 'HtPS1sNkzVMp1VkC7iuW2AZanUnD28vaVgEEJ3gUwfYJ',
        },
        pollInterval: 60_000,
      })
    }
  }, [loadingLends, publicKey, getTotalLends, isLend])

  useEffect(() => {
    if (!loadingBorrows && publicKey && isBorrow) {
      getTotalBorrows({
        variables: {
          address: publicKey.toBase58(),
          // address: 'HtPS1sNkzVMp1VkC7iuW2AZanUnD28vaVgEEJ3gUwfYJ',
        },
        pollInterval: 60_000,
      })
    }
  }, [loadingBorrows, publicKey, getTotalBorrows, isBorrow])

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
          href={`${isLend ? 'lend' : 'borrow'}/history`}
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
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[2.5rem] sm:text-[3rem]">{title}</h1>
        {/* TODO: Bring back after fixing hello moon history */}
        <div className="flex flex-col items-end">
          {isLend && (
            <div className="flex items-center">
              <div className="flex items-center text-[1.6rem] sm:text-[2rem]">
                <span className="text-[#666666]">Total Lent</span>
                {loadingLends ? (
                  <Spin className="ml-3" />
                ) : (
                  <span className="ml-2 text-[1.8rem] text-[#57C0CF] sm:text-[2.2rem]">
                    {toCurrencyFormat(
                      isLend
                        ? lendData?.getTotalLendsByAddress?.total
                        : borrowData?.getTotalBorrowsByAddress?.total
                    )}
                  </span>
                )}
              </div>
              <div className="ml-4 flex items-center text-[1.6rem] sm:text-[2rem]">
                <span className="text-[#666666]">Total Interest Earned</span>
                {loadingLends ? (
                  <Spin className="ml-3" />
                ) : (
                  <span className="ml-2 text-[1.8rem] text-[#57C0CF] sm:text-[2.2rem]">
                    {toCurrencyFormat(
                      isLend
                        ? lendData?.getTotalLendsByAddress?.interest
                        : borrowData?.getTotalBorrowsByAddress?.interest
                    )}
                  </span>
                )}
              </div>
              <div className="ml-4 flex items-center text-[1.6rem] sm:text-[2rem]">
                <span className="text-[#666666]">Foreclosure Rate</span>
                {loadingLends ? (
                  <Spin className="ml-3" />
                ) : (
                  <span className="ml-2 text-[1.8rem] text-[#ccc] sm:text-[2.2rem]">
                    {toCurrencyFormat(
                      lendData?.getTotalLendsByAddress?.foreclosureRate * 100
                    )}
                    %
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center">
            <div className="flex items-center text-[1.8rem] sm:text-[2.2rem]">
              {isLend ? 'Currently Lending' : 'SOL borrowed'}
              {loadingLends || loadingBorrows ? (
                <Spin className="ml-3" />
              ) : (
                <span className="ml-2 text-[2.1rem] text-[#57C0CF] sm:text-[2.5rem]">
                  {toCurrencyFormat(
                    isLend
                      ? lendData?.getTotalLendsByAddress?.totalActive
                      : borrowData?.getTotalBorrowsByAddress?.total
                  )}
                </span>
              )}
            </div>
            <div className="ml-4 flex items-center text-[1.8rem] sm:text-[2.2rem]">
              Current Interest
              {loadingLends || loadingBorrows ? (
                <Spin className="ml-3" />
              ) : (
                <span className="ml-2 text-[2.1rem] text-[#FED007] sm:text-[2.5rem]">
                  {toCurrencyFormat(
                    isLend
                      ? lendData?.getTotalLendsByAddress?.activeInterest
                      : borrowData?.getTotalBorrowsByAddress?.interest
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="text-[1.4rem] opacity-60 sm:text-[1.6rem]">{description}</p>
    </>
  )
}

export default Header
