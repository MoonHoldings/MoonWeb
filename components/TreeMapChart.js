import React from 'react'
import dynamic from 'next/dynamic'

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const TreeMapChart = ({ collections }) => {
  const chart = {
    series: [
      {
        data: collections,
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

  return (
    <div className="flex flex-1 flex-col justify-center rounded-lg bg-[#191C20] px-6 py-8">
      <p className="text-[2rem]">NFT Portfolio Allocation Chart</p>
      {collections.length ? (
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
  )
}

export default TreeMapChart
