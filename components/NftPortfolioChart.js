import React, { useEffect, useRef, useState } from 'react'
import { ColorType, LineType, createChart } from 'lightweight-charts'

export const NftPortfolioChart = ({ data, loading, refetch }) => {
  const chartContainerRef = useRef()
  const chart = useRef()
  const resizeObserver = useRef()
  const [lineSeries, setLineSeries] = useState(null)
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    if (!chart.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.width,
        height: 350,
        layout: {
          background: { type: ColorType.Solid, color: '#000000' },
          textColor: '#50545A',
        },
        grid: {
          vertLines: {
            color: 'rgba(51, 65, 88, 0.3)',
          },
          horzLines: {
            color: 'rgba(51, 65, 88, 0.3)',
          },
        },
        localization: {
          dateFormat: 'MMM dd, yyyy',
        },
      })

      setLineSeries(
        chart.current.addLineSeries({
          color: '#62EAD2',
          lineType: LineType.Curved,
        })
      )
    }
  }, [])

  useEffect(() => {
    chart.current.applyOptions({
      watermark: {
        text: 'Loading Data',
        color: 'rgba(51, 65, 88, 0.7)',
        visible: loading,
      },
    })
  }, [loading])

  useEffect(() => {
    if (lineSeries) {
      lineSeries.setData(data)
    }
  }, [lineSeries])

  useEffect(() => {
    if (lineSeries) {
      lineSeries.setData([])
      lineSeries.setData(data)
      chart.current.timeScale().fitContent()
    }
  }, [data])

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      chart.current.applyOptions({ width, height })

      setTimeout(() => {
        chart.current.timeScale().fitContent()
      }, 0)
    })

    resizeObserver.current.observe(chartContainerRef.current)

    return () => resizeObserver.current.disconnect()
  }, [])

  return (
    <div className="flex w-full flex-col">
      <div className="mt-8 flex inline-flex flex-row justify-end rounded-lg p-2">
        <button
          className={`rounded-lg bg-[#25282C] font-medium text-[#${
            timeRange === 'week' ? '62EAD2' : 'A6A6A6'
          }] px-5 py-2 text-[1.2rem]`}
          onClick={() => {
            refetch('week')
            setTimeRange('week')
          }}
        >
          1W
        </button>
        <button
          className={`ml-3 rounded-lg bg-[#25282C] font-medium text-[#${
            timeRange === 'month' ? '62EAD2' : 'A6A6A6'
          }] px-5 py-2 text-[1.2rem]`}
          onClick={() => {
            refetch('month')
            setTimeRange('month')
          }}
        >
          1M
        </button>
        <button
          className={`ml-3 rounded-lg bg-[#25282C] font-medium text-[#${
            timeRange === 'year' ? '62EAD2' : 'A6A6A6'
          }] px-5 py-2 text-[1.2rem]`}
          onClick={() => {
            refetch('year')
            setTimeRange('year')
          }}
        >
          1Y
        </button>
      </div>

      <div className="flex w-full flex-1 flex-col justify-center rounded-lg bg-[#191C20]">
        <div ref={chartContainerRef} />
      </div>
    </div>
  )
}

export default NftPortfolioChart
