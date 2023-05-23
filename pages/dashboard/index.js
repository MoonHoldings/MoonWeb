import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import mergeClasses from 'utils/mergeClasses'
import { getServerSidePropsWithAuth } from 'utils/withAuth'
import { useLazyQuery } from '@apollo/client'
import { GET_USER_DASHBOARD } from 'utils/queries'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserNfts } from 'redux/reducers/walletSlice'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const Dashboard = () => {
  const dispatch = useDispatch()

  const [timeRangeType, setTimeRangeType] = useState('Day')
  const [getUserDashboard, { data, loading, error, stopPolling }] =
    useLazyQuery(GET_USER_DASHBOARD)
  const dashboardData = data?.getUserDashboard
  const { solUsdPrice } = useSelector((state) => state.crypto)
  const { collections } = useSelector((state) => state.wallet)
  const sortedCollections = collections
    ? [...collections]
        ?.sort(
          (a, b) =>
            b?.floorPrice * b?.nfts?.length - a?.floorPrice * a?.nfts?.length
        )
        .filter((collection) => collection.floorPrice)
    : []

  const cryptoTotal = dashboardData?.crypto?.total ?? 0
  const nftTotal = dashboardData?.nft?.total ?? 0
  const loanTotal = dashboardData?.loan?.total ?? 0
  const borrowTotal = dashboardData?.borrow?.total ?? 0

  const cryptoTotalUsd = dashboardData?.crypto?.total ?? 0
  const nftTotalUsd = dashboardData?.nft?.total
    ? dashboardData?.nft?.total * solUsdPrice
    : 0
  const loanTotalUsd = dashboardData?.loan?.total
    ? dashboardData?.loan?.total * solUsdPrice
    : 0
  const borrowTotalUsd = dashboardData?.borrow?.total
    ? dashboardData?.borrow?.total * solUsdPrice
    : 0

  const totalNetworth = cryptoTotal + nftTotal + loanTotal + borrowTotal
  const totalNetworthUsd = totalNetworth * solUsdPrice

  const cryptoPercent = (cryptoTotal / totalNetworth) * 100
  const nftPercent = (nftTotal / totalNetworth) * 100
  const loanPercent = (loanTotal / totalNetworth) * 100
  const borrowPercent = (borrowTotal / totalNetworth) * 100

  useEffect(() => {
    return () => stopPolling()
  }, [])

  useEffect(() => {
    getUserDashboard({
      variables: {
        timeRangeType,
      },
      pollInterval: 2000,
    })
  }, [timeRangeType, getUserDashboard])

  useEffect(() => {
    dispatch(fetchUserNfts())
  }, [dispatch])

  const getNftTreeMapData = () => {
    const totalValue = sortedCollections.reduce((total, collection) => {
      return total + collection.floorPrice * collection.nfts.length
    }, 0)

    return sortedCollections.map((collection) => ({
      x: collection.name,
      y: (
        ((collection.floorPrice * collection.nfts.length) / totalValue) *
        100
      ).toFixed(2),
      z:
        '$' +
        (
          ((collection.floorPrice * collection.nfts.length) /
            LAMPORTS_PER_SOL) *
          solUsdPrice
        ).toFixed(2),
    }))
  }

  const chart = {
    series: [
      {
        data: getNftTreeMapData(),
      },
    ],
    options: {
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return val
        },
        textAnchor: 'middle',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
        },
      },
      legend: {
        show: false,
      },
      chart: {
        type: 'treemap',
        toolbar: {
          show: false,
        },
        fontFamily: 'poppins',
      },
      colors: [
        '#915BD3',
        '#B951EA',
        '#ADD8C7',
        '#D35BB1',
        '#6C5BD3',
        '#5B84D3',
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        y: {
          formatter: function (val) {
            return val + '%'
          },
        },
        z: {
          title: 'Value',
        },
        style: {
          fontSize: '16px',
        },
      },
    },
  }

  const getPercentageChangeClassName = (value) => {
    if (value < 0) return 'text-[#FE3C00]'
    else if (value == 0) return 'text-[#637381]'
    else return 'text-[#45CB85]'
  }

  return (
    <div className="flex flex-col pb-[4rem] pt-[2rem] sm:pt-0 md:order-2">
      <div class="relative flex h-[20rem] w-full items-start justify-between overflow-hidden rounded-2xl bg-gradient-to-t from-[#3B5049] via-[#0089a07d] to-[#0089a07d] p-6">
        <p className="text-[2.2rem] sm:text-[2.4rem]">
          Welcome to MoonHoldings
        </p>
        <div className="rounded-[30px] bg-[#191C20] p-4">
          <button
            type="button"
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
              true && 'bg-[#3C434B]'
            )}
          >
            SOL
          </button>
          <button
            type="button"
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
              false && 'bg-[#3C434B]'
            )}
          >
            BTC
          </button>
          <button
            type="button"
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
              false && 'bg-[#3C434B]'
            )}
          >
            ETH
          </button>
        </div>
        <Image
          className="absolute bottom-[50%] left-[50%] h-12 w-12 sm:h-14 sm:w-14"
          src="/images/svgs/moon-holdings-logo.svg"
          alt=""
          width="0"
          height="0"
        />
        <Image
          className="absolute bottom-[-20px] h-[50%] w-full"
          src="/images/svgs/dashboard-header-background.svg"
          alt=""
          width="0"
          height="0"
        />
      </div>
      <div className="mt-6 flex items-center justify-between text-[2.6rem]">
        Performance
        <div className="flex h-auto rounded-[30px] bg-[#191C20] p-4">
          <button
            type="button"
            className={mergeClasses(
              'inline-flex',
              'items-center',
              'justify-center',
              'rounded-[30px]',
              'border',
              'border-transparent',
              'py-1.5',
              'px-5',
              'md:text-[1.4rem]',
              'text-[1.2rem]',
              'text-white',
              'focus:outline-none',
              timeRangeType === 'Day' && 'bg-[#3C434B]'
            )}
            onClick={() => setTimeRangeType('Day')}
          >
            1D
          </button>
          <button
            type="button"
            className={mergeClasses(
              'inline-flex',
              'items-center',
              'justify-center',
              'rounded-[30px]',
              'border',
              'border-transparent',
              'py-1.5',
              'px-5',
              'md:text-[1.4rem]',
              'text-[1.2rem]',
              'text-white',
              'focus:outline-none',
              timeRangeType === 'Week' && 'bg-[#3C434B]'
            )}
            onClick={() => setTimeRangeType('Week')}
          >
            1W
          </button>
          <button
            type="button"
            className={mergeClasses(
              'inline-flex',
              'items-center',
              'justify-center',
              'rounded-[30px]',
              'border',
              'border-transparent',
              'py-1.5',
              'px-5',
              'md:text-[1.4rem]',
              'text-[1.2rem]',
              'text-white',
              'focus:outline-none',
              timeRangeType === 'Month' && 'bg-[#3C434B]'
            )}
            onClick={() => setTimeRangeType('Month')}
          >
            1M
          </button>
        </div>
      </div>
      <div className="mt-6 flex w-full flex-col sm:flex-row">
        <div className="flex w-full">
          <div className="flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8">
            <div className="flex w-full">
              <div className="rounded-md bg-[#13c29614] p-6">
                <Image
                  className="h-[3rem] w-[3rem]"
                  src="/images/svgs/dashboard-crypto-icon.svg"
                  alt=""
                  width="0"
                  height="0"
                />
              </div>
              <div className="ml-5">
                <p className="text-[1.8rem]">Crypto</p>
                {/* <p className="text-[1.6rem] text-[#637381]">This week</p> */}
              </div>
            </div>
            <div className="mt-4 text-[2.5rem] font-bold">
              ${cryptoTotalUsd?.toFixed(4)}
            </div>
            {dashboardData?.crypto?.percentChange != 0 && (
              <div
                className={mergeClasses(
                  'text-[1.8rem]',
                  getPercentageChangeClassName(
                    dashboardData?.crypto?.percentChange
                  )
                )}
              >
                {dashboardData?.crypto?.percentChange.toFixed(0)}%
              </div>
            )}
            <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
              Ξ {(cryptoTotalUsd / solUsdPrice).toFixed(4)}
            </div>
          </div>
          <div className="ml-6 mr-0 flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8 sm:mr-3">
            <div className="flex w-full">
              <div className="rounded-md bg-[#3056d314] p-6">
                <Image
                  className="h-[3rem] w-[3rem]"
                  src="/images/svgs/dashboard-nft-icon.svg"
                  alt=""
                  width="0"
                  height="0"
                />
              </div>
              <div className="ml-5">
                <p className="text-[1.8rem]">NFTs</p>
                {/* <p className="text-[1.6rem] text-[#637381]">This week</p> */}
              </div>
            </div>
            <div className="mt-4 text-[2.5rem] font-bold">
              ${nftTotalUsd.toFixed(2)}
            </div>
            {dashboardData?.nft?.percentChange != 0 && (
              <div
                className={mergeClasses(
                  'text-[1.8rem]',
                  getPercentageChangeClassName(
                    dashboardData?.nft?.percentChange
                  )
                )}
              >
                {dashboardData?.nft?.percentChange.toFixed(0)}%
              </div>
            )}
            <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
              Ξ {nftTotal?.toFixed(4)}
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full sm:mt-0">
          <div className="mr-6 flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8 sm:ml-3">
            <div className="flex w-full">
              <div className="rounded-md bg-[#f2994a14] p-6">
                <Image
                  className="h-[3rem] w-[3rem]"
                  src="/images/svgs/dashboard-loans-icon.svg"
                  alt=""
                  width="0"
                  height="0"
                />
              </div>
              <div className="ml-5">
                <p className="text-[1.8rem]">Loans</p>
                {/* <p className="text-[1.6rem] text-[#637381]">This week</p> */}
              </div>
            </div>
            <div className="mt-4 text-[2.5rem] font-bold">
              ${loanTotalUsd.toFixed(2)}
            </div>
            {dashboardData?.loan?.percentChange != 0 && (
              <div
                className={mergeClasses(
                  'text-[1.8rem]',
                  getPercentageChangeClassName(
                    dashboardData?.loan?.percentChange
                  )
                )}
              >
                {dashboardData?.loan?.percentChange.toFixed(0)}%
              </div>
            )}
            <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
              Ξ {loanTotal?.toFixed(4)}
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8">
            <div className="flex w-full">
              <div className="rounded-md bg-[#9b51e014] p-6">
                <Image
                  className="h-[3rem] w-[3rem]"
                  src="/images/svgs/dashboard-borrow-icon.svg"
                  alt=""
                  width="0"
                  height="0"
                />
              </div>
              <div className="ml-5">
                <p className="text-[1.8rem]">Borrow</p>
                {/* <p className="text-[1.6rem] text-[#637381]">This week</p> */}
              </div>
            </div>
            <div className="mt-4 text-[2.5rem] font-bold">
              ${borrowTotalUsd.toFixed(2)}
            </div>
            {dashboardData?.borrow?.percentChange != 0 && (
              <div
                className={mergeClasses(
                  'text-[1.8rem]',
                  getPercentageChangeClassName(
                    dashboardData?.borrow?.percentChange
                  )
                )}
              >
                {dashboardData?.borrow?.percentChange.toFixed(0)}%
              </div>
            )}
            <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
              Ξ {borrowTotal?.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8">
        <div className="flex h-7 w-full">
          {Math.ceil(cryptoPercent) > 0 && (
            <div
              className={`h-full bg-[#13C296]`}
              style={{ width: `${Math.ceil(cryptoPercent)}%` }}
            />
          )}
          {Math.ceil(nftPercent) > 0 && (
            <div
              className={`ml-3 h-full bg-[#3056D3]`}
              style={{ width: `${Math.ceil(nftPercent)}%` }}
            />
          )}
          {Math.ceil(loanPercent) > 0 && (
            <div
              className={`ml-3 h-full bg-[#F2994A]`}
              style={{ width: `${Math.ceil(loanPercent)}%` }}
            />
          )}
          {Math.ceil(borrowPercent) > 0 && (
            <div
              className={`ml-3 h-full bg-[#EF4123]`}
              style={{ width: `${Math.ceil(borrowPercent)}%` }}
            />
          )}
        </div>
        <div className="mt-8 flex justify-between text-[1.6rem] sm:text-[2.4rem]">
          <p>Total Networth</p>
          <p className="font-medium">${totalNetworthUsd.toFixed(2)}</p>
          {dashboardData?.percentChangeTotal != 0 && (
            <p
              className={mergeClasses(
                'text-[#45CB85]',
                getPercentageChangeClassName(dashboardData?.percentChangeTotal)
              )}
            >
              {dashboardData?.percentChangeTotal.toFixed(2)}%
            </p>
          )}
          <p>Ξ {totalNetworth.toFixed(4)}</p>
        </div>
        {/* <div className="mt-6 flex justify-between text-[1.6rem] sm:text-[2.4rem]">
          <p>Liquid Networth</p>
          <p className="font-medium">$447,000</p>
          <p className="text-[#45CB85]">0.189%</p>
          <p>Ξ 239.54983922</p>
        </div> */}
      </div>
      <div className=" mt-6 flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8">
        <p className="text-[2rem]">NFT Portfolio Allocation chart</p>
        {sortedCollections.length ? (
          <ApexCharts
            options={chart.options}
            series={chart.series}
            type="treemap"
            width={'100%'}
            height={350}
          />
        ) : (
          <span className="flex w-full justify-center text-[2rem]">
            Create an NFT Portfolio Now
          </span>
        )}
      </div>
      <Image
        className="mt-6 h-auto w-full"
        src="/images/svgs/ad-sample.svg"
        alt=""
        width="0"
        height="0"
      />
    </div>
  )
}

export default Dashboard
export const getServerSideProps = getServerSidePropsWithAuth
