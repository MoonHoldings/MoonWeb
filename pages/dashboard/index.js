import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import mergeClasses from 'utils/mergeClasses'
import { getServerSidePropsWithAuth } from 'utils/withAuth'
import { useLazyQuery } from '@apollo/client'
import { GET_USER_DASHBOARD } from 'utils/queries'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserNfts } from 'redux/reducers/nftSlice'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { reloadDashboard } from 'redux/reducers/utilSlice'
import { updateCurrency } from 'redux/reducers/cryptoSlice'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import { Skeleton } from 'antd'
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const Dashboard = () => {
  const dispatch = useDispatch()

  const [timeRangeType, setTimeRangeType] = useState('Day')
  const [getUserDashboard, { data, loading }] = useLazyQuery(
    GET_USER_DASHBOARD,
    {
      fetchPolicy: 'no-cache',
    }
  )
  const [updateTimeRangeType, setUpdateTimeRangeType] = useState(true)
  const dashboardData = data?.getUserDashboard
  const {
    solUsdPrice,
    currentCurrency,
    loading: loadingCrypto,
  } = useSelector((state) => state.crypto)
  const { collections } = useSelector((state) => state.nft)

  const sortedCollections = collections
    ? [...collections]
        ?.sort(
          (a, b) =>
            b?.floorPrice * b?.nfts?.length - a?.floorPrice * a?.nfts?.length
        )
        .filter((collection) => collection.floorPrice)
        .slice(0, 10)
    : []

  const { shouldReloadDashboardData } = useSelector((state) => state.util)

  const cryptoTotal = dashboardData?.crypto?.total / solUsdPrice ?? 0
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
    if (shouldReloadDashboardData || updateTimeRangeType) {
      getUserDashboard({
        variables: {
          timeRangeType,
        },
      })

      dispatch(reloadDashboard(false))
      setUpdateTimeRangeType(false)
    }
  }, [
    timeRangeType,
    getUserDashboard,
    dispatch,
    shouldReloadDashboardData,
    data,
    updateTimeRangeType,
  ])

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

  const onChangeTimeRangeType = (type) => {
    setTimeRangeType(type)
    setUpdateTimeRangeType(true)
  }

  const loadValue = (component) => {
    return (
      <>
        {!loadingCrypto && !loading ? (
          <>{component}</>
        ) : (
          <div className="mt-6">
            <Skeleton
              paragraph={{ rows: 2 }}
              title={false}
              loading={true}
              active
            />
          </div>
        )}
      </>
    )
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
              currentCurrency == 'SOL' && 'bg-[#3C434B]'
            )}
            onClick={() => {
              dispatch(updateCurrency('SOL'))
            }}
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
              currentCurrency == 'BTC' && 'bg-[#3C434B]'
            )}
            onClick={() => {
              dispatch(updateCurrency('BTC'))
            }}
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
              currentCurrency == 'ETH' && 'bg-[#3C434B]'
            )}
            onClick={() => {
              dispatch(updateCurrency('ETH'))
            }}
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
            onClick={() => onChangeTimeRangeType('Day')}
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
            onClick={() => onChangeTimeRangeType('Week')}
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
            onClick={() => onChangeTimeRangeType('Month')}
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

            {loadValue(
              <>
                <div className="mt-4 text-[2.5rem] font-bold">
                  ${toCurrencyFormat(cryptoTotalUsd)}
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
                  {currentCurrency === 'BTC'
                    ? '₿'
                    : currentCurrency == 'ETH'
                    ? 'Ξ'
                    : '◎'}{' '}
                  {toCurrencyFormat(cryptoTotalUsd / solUsdPrice)}
                </div>
              </>
            )}
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

            {loadValue(
              <>
                <div className="mt-4 text-[2.5rem] font-bold">
                  ${toCurrencyFormat(nftTotalUsd)}
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
                  {currentCurrency === 'BTC'
                    ? '₿'
                    : currentCurrency == 'ETH'
                    ? 'Ξ'
                    : '◎'}{' '}
                  {toCurrencyFormat(nftTotal)}
                </div>
              </>
            )}
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

            {loadValue(
              <>
                <div className="mt-4 text-[2.5rem] font-bold">
                  ${toCurrencyFormat(loanTotalUsd)}
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
                  {currentCurrency === 'BTC'
                    ? '₿'
                    : currentCurrency === 'ETH'
                    ? 'Ξ'
                    : '◎'}
                  {toCurrencyFormat(loanTotal)}
                </div>
              </>
            )}
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

            {loadValue(
              <>
                <div className="mt-4 text-[2.5rem] font-bold">
                  ${toCurrencyFormat(borrowTotalUsd)}
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
                  {currentCurrency === 'BTC'
                    ? '₿'
                    : currentCurrency == 'ETH'
                    ? 'Ξ'
                    : '◎'}{' '}
                  {toCurrencyFormat(borrowTotal)}
                </div>
              </>
            )}
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
          {loadingCrypto || loading ? (
            <svg
              aria-hidden="true"
              className="mr-2 h-14 w-14 animate-spin fill-teal-400 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            <>
              {totalNetworthUsd !== undefined && (
                <p className="font-medium">
                  ${toCurrencyFormat(totalNetworthUsd)}
                </p>
              )}

              {dashboardData?.percentChangeTotal !== 0 && (
                <p
                  className={mergeClasses(
                    'text-[#45CB85]',
                    getPercentageChangeClassName(
                      dashboardData?.percentChangeTotal
                    )
                  )}
                >
                  {toCurrencyFormat(dashboardData?.percentChangeTotal)}%
                </p>
              )}

              <p>
                {currentCurrency === 'BTC'
                  ? '₿'
                  : currentCurrency === 'ETH'
                  ? 'Ξ'
                  : '◎'}
                {totalNetworth.toFixed(4)}
              </p>
              {toCurrencyFormat(borrowTotal)}
            </>
          )}
        </div>
        {/* <div className="mt-6 flex justify-between text-[1.6rem] sm:text-[2.4rem]">
          <p>Liquid Networth</p>
          <p className="font-medium">$447,000</p>
          <p className="text-[#45CB85]">0.189%</p>
          <p>◎ 239.54983922</p>
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
      <div className="flex w-full justify-center">
        <a
          target="_blank"
          href="https://studio.glassnode.com/partner/moonholdings"
          rel="noopener noreferrer"
        >
          <Image
            className="mt-6 h-auto w-[728px]"
            src="/images/svgs/ad-sample.svg"
            alt=""
            width="0"
            height="0"
          />
        </a>
      </div>
    </div>
  )
}

export default Dashboard
export const getServerSideProps = getServerSidePropsWithAuth
