import Image from 'next/image'
import React from 'react'
import dynamic from 'next/dynamic'
import mergeClasses from 'utils/mergeClasses'

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const Dashboard = () => {
  const chart = {
    series: [
      {
        data: [
          {
            x: 'y00ts: mint t00bs',
            y: 55,
          },
          {
            x: 'Solana Monkey Business',
            y: 15,
          },
          {
            x: 'Chill Chat',
            y: 15,
          },
          {
            x: 'Lotus Gang',
            y: 10,
          },
          {
            x: 'Doge Capital',
            y: 5,
          },
        ],
      },
    ],
    options: {
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          console.log(opts)
          return val + ' ' + `${opts.value}%`
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
        enabled: false,
      },
    },
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
              true && 'bg-[#3C434B]'
            )}
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
              false && 'bg-[#3C434B]'
            )}
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
              false && 'bg-[#3C434B]'
            )}
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
                <p className="text-[1.6rem] text-[#637381]">This week</p>
              </div>
            </div>
            <div className="mt-4 text-[2.5rem] font-bold">$390,000</div>
            <div className="text-[1.8rem] text-[#45CB85]">0.39%</div>
            <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
              Ξ {(209.00321543).toFixed(4)}
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
                <p className="text-[1.8rem]">NFT</p>
                <p className="text-[1.6rem] text-[#637381]">This week</p>
              </div>
            </div>
            <div className="mt-4 text-[2.5rem] font-bold">$57,000</div>
            <div className="text-[1.8rem] text-[#45CB85]">0.39%</div>
            <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
              Ξ {(209.00321543).toFixed(4)}
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
                <p className="text-[1.6rem] text-[#637381]">This week</p>
              </div>
            </div>
            <div className="mt-4 text-[2.5rem] font-bold">$113,000</div>
            <div className="text-[1.8rem] text-[#45CB85]">0.39%</div>
            <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
              Ξ {(209.00321543).toFixed(4)}
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
                <p className="text-[1.6rem] text-[#637381]">This week</p>
              </div>
            </div>
            <div className="mt-4 text-[2.5rem] font-bold">$12,033</div>
            <div className="text-[1.8rem] text-[#45CB85]">0.39%</div>
            <div className="text-[2.2rem] font-bold text-[#637381] xl:text-[2.4rem]">
              Ξ {(209.00321543).toFixed(4)}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8">
        <div className="flex h-7 w-full">
          <div className="h-full w-[60%] bg-[#13C296]" />
          <div className="ml-3 h-full w-[6%] bg-[#3056D3]" />
          <div className="ml-3 h-full w-[21%] bg-[#F2994A]" />
          <div className="ml-3 h-full w-[13%] bg-[#EF4123]" />
        </div>
        <div className="mt-8 flex justify-between text-[1.6rem] sm:text-[2.4rem]">
          <p>Total Networth</p>
          <p className="font-medium">$547,967</p>
          <p className="text-[#45CB85]">0.39%</p>
          <p>Ξ 293.65862808</p>
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
        <ApexCharts
          options={chart.options}
          series={chart.series}
          type="treemap"
          width={'100%'}
          height={350}
        />
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
