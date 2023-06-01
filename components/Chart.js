import React, { useEffect, useRef, useState } from 'react'
import { ColorType, CrosshairMode, createChart } from 'lightweight-charts'
import { formatChartData } from 'utils/chartDataConverter'
import Image from 'next/image'

export const CandlestickChart = ({ candleStickData }) => {
  const chartContainerRef = useRef()
  const chart = useRef()
  const resizeObserver = useRef()

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.width,
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
        secondsVisible: false,
        barSpacing: 5,
      },
    })
  }, [])

  useEffect(() => {
    const candleSeries = chart.current.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
    })

    const data = formatChartData(candleStickData)
    if (data.length > 0) candleSeries.setData(data)
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

  return <div ref={chartContainerRef} />
}

export default CandlestickChart
