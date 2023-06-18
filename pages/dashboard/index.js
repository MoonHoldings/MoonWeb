import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import mergeClasses from 'utils/mergeClasses'
import { useLazyQuery } from '@apollo/client'
import { GET_USER_DASHBOARD } from 'utils/queries'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserNfts } from 'redux/reducers/nftSlice'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { reloadDashboard } from 'redux/reducers/utilSlice'
import { updateCurrency } from 'redux/reducers/cryptoSlice'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import { Skeleton } from 'antd'
import { populatePortfolioTotals } from 'redux/reducers/portfolioSlice'
import { useRouter } from 'next/router'
import withAuth from 'hoc/withAuth'
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const Dashboard = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { tokenHeader } = useSelector((state) => state.auth)
  const [timeRangeType, setTimeRangeType] = useState('Day')
  const [getUserDashboard, { data, loading }] = useLazyQuery(
    GET_USER_DASHBOARD,
    {
      fetchPolicy: 'no-cache',
      context: tokenHeader,
    }
  )
  const [updateTimeRangeType, setUpdateTimeRangeType] = useState(true)
  const dashboardData = data?.getUserDashboard
  const {
    solUsdPrice,
    currentCurrency,
    selectedCurrencyPrice,
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

  const cryptoTotal = dashboardData?.crypto?.total / selectedCurrencyPrice ?? 0
  const nftTotal =
    (dashboardData?.nft?.total * solUsdPrice) / selectedCurrencyPrice ?? 0
  const loanTotal =
    (dashboardData?.loan?.total * solUsdPrice) / selectedCurrencyPrice ?? 0
  const borrowTotal =
    (dashboardData?.borrow?.total * solUsdPrice) / selectedCurrencyPrice ?? 0

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
  const totalNetworthUsd =
    currentCurrency == 'SOL'
      ? totalNetworth * solUsdPrice
      : totalNetworth * selectedCurrencyPrice

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
        tokenHeader,
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
    if (dashboardData) {
      dispatch(
        populatePortfolioTotals({
          cryptoTotal: dashboardData.crypto.total,
          nftTotal: dashboardData.nft.total,
          borrowTotal: dashboardData.borrow.total,
          loanTotal: dashboardData.loan.total,
        })
      )
    }
  }, [dashboardData, dispatch])

  useEffect(() => {
    dispatch(fetchUserNfts({}))
    dispatch(updateCurrency(currentCurrency ?? 'SOL'))
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

  const getCurrencySymbol = () => {
    if (currentCurrency === 'BTC') return '₿'
    else if (currentCurrency === 'ETH') return 'Ξ'
    else return '◎'
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

  const loadDollarValue = (component) => {
    return (
      <>
        {!loading ? (
          <>{component}</>
        ) : (
          <div className="mt-6">
            <Skeleton
              paragraph={{ rows: 1 }}
              title={false}
              loading={true}
              active
            />
          </div>
        )}
      </>
    )
  }

  const handleClick = (url) => {
    router.push(`/${url}`)
  }

  return (
    <div className="flex flex-col pb-[4rem] pt-[2rem] sm:pt-0 md:order-2">
      <div class="relative flex h-[20rem] w-full items-start justify-between overflow-hidden rounded-2xl bg-gradient-to-t from-[#3B5049] via-[#0089a07d] to-[#0089a07d] p-6">
        <p className="text-[2.2rem] sm:text-[2.4rem]"></p>
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
              <div
                className="cursor-pointer rounded-md bg-[#13c29614] p-6"
                onClick={() => handleClick('crypto')}
              >
                <Image
                  className="h-[3rem] w-[3rem]"
                  src="/images/svgs/dashboard-crypto-icon.svg"
                  alt=""
                  width="0"
                  height="0"
                />
              </div>
              <div className="ml-5">
                <p
                  className="cursor-pointer text-[1.8rem]"
                  onClick={() => handleClick('crypto')}
                >
                  Crypto
                </p>
                {/* <p className="text-[1.6rem] text-[#637381]">This week</p> */}
              </div>
            </div>

            {loadDollarValue(
              <div className="mt-4 text-[2.5rem] font-bold">
                ${toCurrencyFormat(cryptoTotalUsd)}
              </div>
            )}

            {loadValue(
              <>
                {dashboardData?.crypto?.percentChange != 0 ? (
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
                ) : (
                  <div className="text-[1.8rem] text-[#637381]">-</div>
                )}
                <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
                  {getCurrencySymbol()}
                  {toCurrencyFormat(
                    cryptoTotalUsd /
                      (currentCurrency === 'SOL'
                        ? solUsdPrice
                        : selectedCurrencyPrice)
                  )}
                </div>
              </>
            )}
          </div>
          <div className="ml-6 mr-0 flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8 sm:mr-3">
            <div className="flex w-full">
              <div
                className="cursor-pointer rounded-md bg-[#3056d314] p-6"
                onClick={() => handleClick('nfts')}
              >
                <Image
                  className="h-[3rem] w-[3rem]"
                  src="/images/svgs/dashboard-nft-icon.svg"
                  alt=""
                  width="0"
                  height="0"
                />
              </div>
              <div className="ml-5">
                <p
                  className="cursor-pointer text-[1.8rem]"
                  onClick={() => handleClick('nfts')}
                >
                  NFTs
                </p>
                {/* <p className="text-[1.6rem] text-[#637381]">This week</p> */}
              </div>
            </div>
            {loadDollarValue(
              <div className="mt-4 text-[2.5rem] font-bold">
                ${toCurrencyFormat(nftTotalUsd)}
              </div>
            )}

            {loadValue(
              <>
                {dashboardData?.nft?.percentChange != 0 ? (
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
                ) : (
                  <div className="text-[1.8rem] text-[#637381]">-</div>
                )}
                <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
                  {getCurrencySymbol()}
                  {toCurrencyFormat(nftTotal)}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex w-full sm:mt-0">
          <div className="mr-6 flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8 sm:ml-3">
            <div className="flex w-full">
              <div
                className="cursor-pointer rounded-md bg-[#f2994a14] p-6"
                onClick={() => handleClick('defi-loans/lend')}
              >
                <Image
                  className="h-[3rem] w-[3rem]"
                  src="/images/svgs/dashboard-loans-icon.svg"
                  alt=""
                  width="0"
                  height="0"
                />
              </div>
              <div className="ml-5">
                <p
                  className="cursor-pointer text-[1.8rem]"
                  onClick={() => handleClick('defi-loans/lend')}
                >
                  Loans
                </p>
                {/* <p className="text-[1.6rem] text-[#637381]">This week</p> */}
              </div>
            </div>
            {loadDollarValue(
              <div className="mt-4 text-[2.5rem] font-bold">
                ${toCurrencyFormat(loanTotalUsd)}
              </div>
            )}

            {loadValue(
              <>
                {dashboardData?.loan?.percentChange != 0 ? (
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
                ) : (
                  <div className="text-[1.8rem] text-[#637381]">-</div>
                )}
                <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
                  {getCurrencySymbol()}
                  {toCurrencyFormat(loanTotal)}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8">
            <div className="flex w-full">
              <div
                className="cursor-pointer rounded-md bg-[#9b51e014] p-6"
                onClick={() => handleClick('defi-loans/borrow')}
              >
                <Image
                  className="h-[3rem] w-[3rem]"
                  src="/images/svgs/dashboard-borrow-icon.svg"
                  alt=""
                  width="0"
                  height="0"
                />
              </div>
              <div className="ml-5">
                <p
                  className="cursor-pointer text-[1.8rem]"
                  onClick={() => handleClick('defi-loans/borrow')}
                >
                  Borrow
                </p>
                {/* <p className="text-[1.6rem] text-[#637381]">This week</p> */}
              </div>
            </div>

            {loadDollarValue(
              <div className="mt-4 text-[2.5rem] font-bold">
                ${toCurrencyFormat(borrowTotalUsd)}
              </div>
            )}

            {loadValue(
              <>
                {dashboardData?.borrow?.percentChange != 0 ? (
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
                ) : (
                  <div className="text-[1.8rem] text-[#637381]">-</div>
                )}
                <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
                  {getCurrencySymbol()}
                  {toCurrencyFormat(borrowTotal)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8">
        <div className="flex h-7 w-full overflow-hidden rounded-l-lg rounded-r-lg">
          {loadingCrypto || loading ? (
            <Skeleton
              paragraph={{ rows: 1, width: '100%' }}
              title={false}
              loading={true}
              active
            />
          ) : (
            <>
              {Math.ceil(cryptoPercent) > 0 && (
                <div
                  className={`h-full bg-[#13C296]`}
                  style={{ width: `${Math.ceil(cryptoPercent)}%` }}
                />
              )}
              {Math.ceil(nftPercent) > 0 && (
                <div
                  className={`h-full bg-[#3056D3] ${
                    Math.ceil(cryptoPercent) > 0 && 'ml-3'
                  }`}
                  style={{ width: `${Math.ceil(nftPercent)}%` }}
                />
              )}
              {Math.ceil(loanPercent) > 0 && (
                <div
                  className={`h-full bg-[#F2994A] ${
                    Math.ceil(nftPercent) > 0 &&
                    Math.ceil(cryptoPercent) > 0 &&
                    'ml-3'
                  }`}
                  style={{ width: `${Math.ceil(loanPercent)}%` }}
                />
              )}
              {Math.ceil(borrowPercent) > 0 && (
                <div
                  className={`h-full bg-[#EF4123] ${
                    Math.ceil(nftPercent) > 0 &&
                    Math.ceil(cryptoPercent) > 0 &&
                    Math.ceil(loanPercent) > 0 &&
                    'ml-3'
                  }`}
                  style={{ width: `${Math.ceil(borrowPercent)}%` }}
                />
              )}
            </>
          )}
        </div>
        <div className="mt-8 flex justify-between text-[1.6rem] sm:text-[2.4rem]">
          <p>Total Networth</p>
          {loadingCrypto || loading ? (
            <div className="mt-2 flex h-8 w-2/3 flex-row items-center justify-end pl-16 md:w-3/4">
              <Skeleton
                paragraph={{ rows: 1 }}
                title={false}
                loading={true}
                active
              />
              <Skeleton
                paragraph={{ rows: 1 }}
                title={false}
                loading={true}
                active
              />
              <Skeleton
                paragraph={{ rows: 1 }}
                title={false}
                loading={true}
                active
              />
            </div>
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
                {getCurrencySymbol()}
                {toCurrencyFormat(totalNetworth)}
              </p>
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

export default withAuth(Dashboard)
