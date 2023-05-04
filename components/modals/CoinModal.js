import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import { changeCoinModalOpen } from 'redux/reducers/utilSlice'

const CoinModal = () => {
  const { coinModalOpen } = useSelector((state) => state.util)
  const dispatch = useDispatch()

  const [coinArray, setCoinArray] = useState([
    {
      wallet: 'Wallet 1',
      holdings: '2',
      value: '$123,456.78',
    },
    {
      wallet: 'Wallet 2',
      holdings: '0.50000000',
      value: '$12,345.67',
    },
    {
      wallet: 'Wallet 3',
      holdings: '0.25000000',
      value: '$6,789.01',
    },
  ])

  const [selectedItem, setSelectedItem] = useState(null)
  const [wallet, setWallet] = useState('')
  const [holdings, setHoldings] = useState('')
  const [showAddRow, setShowAddRow] = useState(false)

  const handleAddCoin = () => {
    setShowAddRow(!showAddRow)
  }

  //call backend to remove coin
  const handleRemoveCoin = () => {}

  //call backend to save coin
  const onSave = () => {
    const newCoinArray = [...coinArray, { wallet, holdings, value: '0.00' }]
    setCoinArray(newCoinArray)
    setWallet('')
    setHoldings('')
    setShowAddRow(false)
  }

  const closeCoinModal = () => {
    dispatch(changeCoinModalOpen(false))
  }

  const handleItemClick = (index) => {
    if (index == selectedItem) setSelectedItem(null)
    else setSelectedItem(index)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex items-center justify-center font-inter"
    >
      <Overlay closeCoinModal={closeCoinModal} />
      <div className="modal relative mx-8 flex w-full flex-col rounded-[1.25rem] bg-[#191C20] p-[2rem] text-white shadow-lg md:max-w-[48rem] xl:min-h-[28rem] xl:max-w-[60rem]">
        <div className="mb-[1.5rem] flex items-center justify-between">
          <h1 className="text-center text-[1.5rem] font-bold">BTC - Bitcoin</h1>
          <button onClick={closeCoinModal} className="h-7 w-7">
            <Image
              src="/images/svgs/cross-btn.svg"
              alt="cross button"
              width={20}
              height={20}
              className="h-full w-full object-cover object-center"
            />
          </button>
        </div>
        <div className="max-h-[24rem] overflow-y-auto">
          <div class="flex w-full items-center justify-between px-[2rem] py-[1rem] text-[1.5rem]">
            <div class="w-1/3 ">
              <span>Wallet</span>
            </div>
            <div class="w-1/3 text-center">
              <span>Holdings</span>
            </div>
            <div class="w-1/3 text-end">
              <span>Value</span>
            </div>
          </div>
          {coinArray.map((coin, index) => (
            <div
              key={index}
              className={`flex w-full items-center justify-between border border-black bg-[#191C20] px-[2rem] py-[1rem] text-[1.5rem] hover:cursor-pointer hover:bg-[#383C42] ${
                index === 0 && 'rounded-tl-[0.5rem] rounded-tr-[0.5rem]'
              } ${
                index === coinArray.length - 1 &&
                'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
              } ${index !== 0 && 'border-t-[0]'} ${
                selectedItem === index && 'bg-[#383C42]'
              }`}
              onClick={() => handleItemClick(index)}
            >
              <div className="w-1/3 overflow-hidden truncate">
                <span>{coin.wallet}</span>
              </div>
              <div className="w-1/3 overflow-hidden truncate text-center">
                <span>{coin.holdings}</span>
              </div>
              <div className="w-1/3 overflow-hidden truncate text-end">
                <span>{coin.value}</span>
              </div>
            </div>
          ))}
          {showAddRow && (
            <div className="flex w-full items-center justify-between rounded-b-[0.5rem] border border-black bg-[#191C20] px-[2rem] py-[1rem] text-[1.5rem]">
              <input
                type="text"
                placeholder="Wallet Name"
                className="w-1/3 bg-transparent focus:outline-none"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
              <input
                type="number"
                placeholder="Holdings"
                className="w-1/3 bg-transparent text-center focus:outline-none"
                value={holdings}
                onChange={(e) => setHoldings(e.target.value)}
              />
              <div className="w-1/3 text-end">
                <button
                  onClick={onSave}
                  className="w-full rounded-[1rem] bg-green-500 px-2 py-1 hover:bg-green-600 focus:outline-none"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-row items-center ">
          <button
            disabled={showAddRow}
            onClick={handleRemoveCoin}
            id="btn-add-wallet"
            class="spinner mr-2 h-[4.6rem] w-[100%] rounded-[0.5rem] border border-black bg-[#E05E28] text-center text-[1.4rem] font-[500] hover:bg-[#D04922]"
          >
            REMOVE BTC
          </button>
          <button
            onClick={handleAddCoin}
            id="btn-add-wallet"
            class="spinner ml-2 h-[4.6rem] w-[100%] rounded-[0.5rem] border border-black bg-[#5B218F] text-center text-[1.4rem] font-[500] hover:bg-[#4A1A7C]"
          >
            {!showAddRow ? 'ADD WALLET' : 'Cancel'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const Overlay = ({ closeCoinModal }) => {
  return (
    <div
      onClick={closeCoinModal}
      className="absolute bottom-0 left-0 right-0 top-0 bg-[#00000099]"
    />
  )
}

export default CoinModal
