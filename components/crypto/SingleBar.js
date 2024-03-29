import { Tooltip } from 'antd'
import numeral from 'numeral'
import React, { useRef, useEffect, useState } from 'react'

const SingleBar = ({ crypto, myCoins, index }) => {
  const chartRef = useRef(null)
  const [barWidth, setBarWidth] = useState(0)
  const [isTooltip, setIsTooltip] = useState(false)

  useEffect(() => {
    const div = chartRef.current
    const { width } = div.getBoundingClientRect()
    setBarWidth(width)
  }, [barWidth, chartRef, myCoins])

  const barHover = () => {
    setIsTooltip((prev) => !prev)
  }

  const pct = (holding, price) => {
    let valueSum = 0
    myCoins.forEach((crypto) => {
      valueSum += crypto.holdings * crypto.price
    })
    const thePct = (holding * price * 100) / valueSum
    return thePct
  }
  const totalValue = (holding, price) => {
    const value = holding * price
    return numeral(value).format('0,0.00')
  }

  return (
    <div
      ref={chartRef}
      className="flex h-[5.5rem] cursor-default flex-col items-center justify-center"
      onMouseOver={barHover}
      onMouseOut={barHover}
      style={{
        background: crypto.color,
        color: crypto.color == '#FFFFFF' ? 'black' : 'white',
        width: pct(crypto.holdings, crypto.price) + '%',
        borderRight: index !== myCoins.length - 1 && '0.01px solid #000000',
        borderTopLeftRadius: index === 0 && '0.5rem',
        borderTopRightRadius: index === myCoins.length - 1 && '0.5rem',
        borderBottomRightRadius: index === myCoins.length - 1 && '0.5rem',
        borderBottomLeftRadius: index === 0 && '0.5rem',
      }}
    >
      {/* {Math.round(barWidth)} */}
      {barWidth > 35 ? (
        <Tooltip
          color="#1F2126"
          title={
            <span className="text-[1.5rem]">
              ${totalValue(crypto.holdings, crypto.price)}
            </span>
          }
        >
          {/* {isTooltip && (
            <div className="fixed mb-36 rounded-[0.4rem] bg-[#464646] p-[0.5rem] text-[1rem] text-[#fff]">
              <div className="text-center font-[600]">
                <span>${totalValue(crypto.holdings, crypto.price)}</span>
              </div>
            </div>
          )} */}
          <div className="text-[1.4rem] font-[600]">
            <span>{Math.round(pct(crypto.holdings, crypto.price))}</span>
            <span className="font-[300]">%</span>
          </div>
          <div className="text-[1.4rem] font-[300] leading-[1.4rem]">
            {crypto.symbol}
          </div>
        </Tooltip>
      ) : (
        <>
          {isTooltip && (
            <div className="small-bar relative bottom-[6rem] rounded-[0.4rem] bg-[#464646] p-[0.5rem] text-[1rem] text-[#fff]">
              <div className="text-center font-[600]">
                <span>${totalValue(crypto.holdings, crypto.price)}</span>
              </div>
              <div className=" font-[300] leading-[1.4rem]">
                {crypto.symbol}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
export default SingleBar
