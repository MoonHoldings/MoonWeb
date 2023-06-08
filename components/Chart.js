import React, { useEffect, useRef, useState } from 'react'
import { ColorType, CrosshairMode, createChart } from 'lightweight-charts'
import { formatChartData } from 'utils/chartDataConverter'
import Image from 'next/image'
import mergeClasses from 'utils/mergeClasses'
import { fetchHelloMoonCollectionIds } from 'redux/reducers/nftSlice'
import { GRANULARITY } from 'types/enums'
import { useDispatch } from 'react-redux'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export const CandlestickChart = ({ candleStickData, mint, headerData }) => {
  const dispatch = useDispatch()
  const chartContainerRef = useRef()
  const chart = useRef()
  const resizeObserver = useRef()
  const [chartData, setChartData] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const [filter, setFilter] = useState('1d')
  const [candleSeries, setCandleSeries] = useState(null)

  const gOptions = [
    { label: '1m', value: GRANULARITY.ONE_MIN },
    { label: '5m', value: GRANULARITY.FIVE_MIN },
    { label: '1h', value: GRANULARITY.ONE_HOUR },
    { label: '1d', value: GRANULARITY.ONE_DAY },
    { label: '1w', value: GRANULARITY.ONE_WEEK },
  ]
  useEffect(() => {
    if (!chart.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.width,
        height: 350,
        layout: {
          background: { type: ColorType.Solid, color: '#000000' },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: 'rgba(51, 65, 88, 0.3)',
          },
          horzLines: {
            color: 'rgba(51, 65, 88, 0.3)',
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        priceScale: {
          borderColor: '#485c7b',
        },
        timeScale: {
          borderColor: '#485c7b',
          rightOffset: 10, // Adjust the right offset for the filter options
          timeVisible: true,
          secondsVisible: true,
          barSpacing: 5,
        },
      })
      setCandleSeries(
        chart.current.addCandlestickSeries({
          upColor: '#4bffb5',
          downColor: '#ff4976',
          borderDownColor: '#ff4976',
          borderUpColor: '#4bffb5',
        })
      )
    }
  }, [])

  useEffect(() => {
    if (candleSeries) {
      candleSeries.setData(formatChartData(candleStickData))
    }
  }, [candleSeries])

  useEffect(() => {
    if (candleSeries) {
      candleSeries.setData([])
      candleSeries.setData(formatChartData(candleStickData))
    }
  }, [candleStickData])

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

  const handleFocus = () => {
    setIsFocused(!isFocused)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false)
    }, 200)
  }

  const onSelectTime = (granularity) => {
    dispatch(
      fetchHelloMoonCollectionIds({
        granularity: granularity.value,
        mint: mint,
      })
    )
    setFilter(granularity.label)
  }

  const formatFloorPriceTotal = (price) => {
    return toCurrencyFormat(price / LAMPORTS_PER_SOL)
  }

  return (
    <div className="flex flex-col">
      <div className="mt-8 flex inline-flex flex-row justify-between rounded-lg p-2">
        <div className="flex flex-row text-[#666]">
          <div className="bold flex flex-col text-[1.5rem] md:text-[1.5rem]">
            Supply
            <div className="flex text-white">{headerData.supply}</div>
          </div>
          <div className="bold ml-6 flex  flex-col text-[1.5rem]">
            Volume (24h)
            <div className="flex text-white">
              {formatFloorPriceTotal(headerData.volume)}◎
            </div>
          </div>
          <div className="bold ml-6  flex flex-col text-[1.5rem]">
            Owner Count
            <div className="flex text-white">{headerData.owner_count}</div>
          </div>
          <div className="bold ml-6  flex flex-col text-[1.5rem]">
            All time High
            <div className="flex text-white">
              {formatFloorPriceTotal(headerData.ath)}◎
            </div>
          </div>
          <div className="bold ml-6  flex flex-col text-[1.5rem]">
            All time Low
            <div className="flex text-white" text-white>
              {formatFloorPriceTotal(headerData.atl)}◎
            </div>
          </div>
        </div>
        <div className="relative flex items-end bg-transparent">
          <input
            className={`block h-16 w-16 cursor-pointer appearance-none rounded-xl border border-black bg-gray-900 text-center text-[1.5rem] placeholder-white caret-transparent ring-transparent focus:text-teal-200 focus:placeholder-teal-200 focus:outline-none focus:ring-1 focus:ring-teal-200 `}
            placeholder="D"
            value={filter}
            onClick={handleFocus}
            onBlur={handleBlur}
          />
          {isFocused && (
            <div className="absolute left-0 top-full z-20 mt-1  max-h-64 w-full overflow-y-auto rounded-b-xl bg-gray-900 shadow-lg">
              <ul className="py-2">
                {gOptions.map((granularity) => (
                  <li
                    onClick={() => {
                      onSelectTime(granularity)
                    }}
                    className="cursor-pointer py-3 text-center text-[1.5rem] text-teal-200  hover:bg-gray-800 "
                    key={granularity.label}
                  >
                    {granularity.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col justify-center rounded-lg bg-[#191C20]">
        <div ref={chartContainerRef} />
      </div>
    </div>
  )
}

export default CandlestickChart
