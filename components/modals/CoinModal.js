import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import { changeCoinModalOpen } from 'redux/reducers/utilSlice'
import {
  populatePortfolioCoins,
  reloadPortfolio,
} from 'redux/reducers/portfolioSlice'
import { useMutation } from '@apollo/client'
import {
  ADD_USER_COIN,
  DELETE_USER_COIN,
  DELETE_USER_COIN_BY_SYMBOL,
  EDIT_USER_COIN,
} from 'utils/mutations'

const CoinModal = () => {
  const dispatch = useDispatch()
  const { coinModalOpen } = useSelector((state) => state.util)
  const { coins, coinName, coinSymbol, coinPrice } = useSelector(
    (state) => state.portfolio
  )
  const [coinArray, setCoinArray] = useState(coins)

  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [wallet, setWallet] = useState('')
  const [holdings, setHoldings] = useState('')
  const [showAddRow, setShowAddRow] = useState(false)

  const [editWallet, setEditWallet] = useState('')
  const [editHoldings, setEditHoldings] = useState('')

  const [addUserCoin] = useMutation(ADD_USER_COIN)
  const [editUserCoin] = useMutation(EDIT_USER_COIN)
  const [deleteUserCoin] = useMutation(DELETE_USER_COIN)
  const [deleteUserCoinBySymbol] = useMutation(DELETE_USER_COIN_BY_SYMBOL)
  const containerRef = useRef(null)

  useEffect(() => {
    setCoinArray(coins)
  }, [coins])

  useEffect(() => {
    if (containerRef.current != null)
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight)
  }, [coinArray, showAddRow])

  const handleAddCoin = () => {
    setShowAddRow(!showAddRow)
  }

  const handleRemoveCoin = async (item) => {
    const coinData = {
      id: parseInt(item.id),
      name: item.name,
      symbol: item.symbol,
      walletName: item.walletName,
      holdings: parseInt(item.holdings),
    }

    try {
      const res = await deleteUserCoin({
        variables: {
          coinData,
        },
      })
      if (res.data.deleteUserCoin) {
        const updatedCoinArray = coinArray.filter((coin) => coin.id !== item.id)
        setCoinArray(updatedCoinArray)
        dispatch(reloadPortfolio(true))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveAllCoins = async () => {
    try {
      const res = await deleteUserCoinBySymbol({
        variables: {
          symbol: coinSymbol,
        },
      })

      if (res.data.deleteUserCoinBySymbol) {
        const updatedCoinArray = []
        setCoinArray(updatedCoinArray)
        dispatch(reloadPortfolio(true))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onSave = async () => {
    const coinData = {
      name: coinName,
      symbol: coinSymbol,
      walletName: wallet,
      holdings: parseFloat(holdings),
    }

    try {
      const res = await addUserCoin({
        variables: {
          coinData,
        },
      })
      if (res.data.addUserCoin) {
        const newArray = [...coinArray]
        const newLastItem = res.data.addUserCoin
        newArray.push(newLastItem)
        setCoinArray(newArray)
        dispatch(reloadPortfolio(true))
      }
    } catch (error) {
      console.log(error.message)
    }

    setWallet('')
    setHoldings('')
    setShowAddRow(false)
  }

  const onEdit = async () => {
    const coinData = {
      id: parseInt(selectedCoin.id),
      name: coinName,
      symbol: coinSymbol,
      walletName: editWallet,
      holdings: parseFloat(editHoldings),
      walletId: selectedCoin.walletId,
    }

    try {
      const res = await editUserCoin({
        variables: {
          coinData,
        },
      })
      if (res.data.editUserCoin) {
        const newArray = [...coinArray]
        newArray[selectedItem] = {
          ...newArray[selectedItem],
          walletName: coinData.walletName,
          holdings: coinData.holdings,
        }

        setCoinArray(newArray)
        dispatch(reloadPortfolio(true))
      }
    } catch (error) {
      console.log(error.message)
    }

    setEditWallet('')
    setEditHoldings('')
    setSelectedItem(null)
    setSelectedCoin(null)
  }

  const closeCoinModal = () => {
    setWallet('')
    setHoldings('')
    setShowAddRow(false)
    setSelectedCoin(null)
    setSelectedItem(null)
    dispatch(changeCoinModalOpen(false))
    dispatch(
      populatePortfolioCoins({
        coins: [],
        name: null,
        symbol: null,
        coinPrice: 0,
      })
    )
  }

  const handleItemClick = (index, coin) => {
    if (index == selectedItem) {
      setSelectedItem(null)
      setSelectedCoin(null)
    } else {
      setSelectedItem(index)
      setSelectedCoin(coin)
    }
  }

  const addRowComponent = () => {
    return (
      <div className="flex w-full rounded-[0.5rem] border border-black bg-[#174146] px-[2rem] py-4 text-[1.5rem]">
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Wallet"
            className="w-3/4 rounded-[0.5rem] bg-[#25282C] py-2 pl-2 focus:outline-none"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
        </div>
        <div className="w-1/3 ">
          <input
            type="number"
            placeholder="Holdings"
            className="w-3/4 rounded-[0.5rem] bg-[#25282C] py-2 pl-2 focus:outline-none"
            value={holdings}
            onChange={(e) => setHoldings(e.target.value)}
          />
        </div>
        <div className="flex w-1/3 items-center justify-between">
          <button
            onClick={onSave}
            className="w-3/4 rounded-[1rem] bg-green-500 px-2 py-2 hover:bg-green-600 focus:outline-none"
          >
            Save
          </button>

          <button
            onClick={() => {
              if (selectedItem != null) handleItemClick(selectedItem)
              if (showAddRow) setShowAddRow(false)
            }}
            className="ml-2 h-7 w-7"
          >
            <Image
              src="/images/svgs/cross-btn.svg"
              alt="cross button"
              width={20}
              height={20}
              className="h-full w-full object-cover object-center"
            />
          </button>
        </div>
      </div>
    )
  }

  const editRowComponent = (coin) => {
    return (
      <div className="flex w-full rounded-[0.5rem] border border-black bg-[#174146] px-[2rem] py-4 text-[1.5rem]">
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Wallet"
            className="w-3/4 rounded-[0.5rem] bg-[#25282C] py-2 pl-2 focus:outline-none"
            value={editWallet}
            onChange={(e) => {
              setEditWallet(e.target.value)
            }}
          />
        </div>
        <div className="w-1/3 ">
          <input
            type="number"
            placeholder="Holdings"
            className="w-3/4 rounded-[0.5rem] bg-[#25282C] py-2 pl-2 focus:outline-none"
            value={editHoldings}
            onChange={(e) => setEditHoldings(e.target.value)}
          />
        </div>
        <div className="flex w-1/3 items-center justify-between">
          <button
            onClick={onEdit}
            className="w-3/4 rounded-[1rem] bg-green-500 px-2 py-2 hover:bg-green-600 focus:outline-none"
          >
            Save
          </button>

          <button
            onClick={() => {
              if (selectedItem != null) handleItemClick(selectedItem)
              if (showAddRow) setShowAddRow(false)
            }}
            className="ml-2 h-7 w-7"
          >
            <Image
              src="/images/svgs/cross-btn.svg"
              alt="cross button"
              width={20}
              height={20}
              className="h-full w-full object-cover object-center"
            />
          </button>
        </div>
      </div>
    )
  }
  const coinComponent = (index, coin) => {
    return (
      <div
        key={index}
        className={`flex w-full items-center justify-between border border-black bg-[#191C20] px-[2rem] py-[1rem] text-[1.5rem]  ${
          index === 0 && 'rounded-tl-[0.5rem] rounded-tr-[0.5rem]'
        } ${
          index === coinArray.length - 1 &&
          'rounded-bl-[0.5rem] rounded-br-[0.5rem] '
        } ${index !== 0 && 'border-t-[0]'} ${
          selectedItem === index && 'bg-[#383C42] '
        }${
          showAddRow || selectedItem != null
            ? 'pointer-events-none opacity-50'
            : 'hover:cursor-pointer hover:bg-[#383C42]'
        }`}
      >
        <div className="flex w-full flex-row ">
          <div className="w-1/3 overflow-hidden truncate pl-2">
            <span>
              {coin.walletName
                ? coin.walletName
                : coin.walletAddress
                ? coin.walletAddress.substring(0, 5)
                : ''}
            </span>
          </div>
          <div className="w-1/3 overflow-hidden truncate pl-2">
            <span>{coin.holdings}</span>
          </div>
          <div className="flex w-1/3 flex-row justify-between">
            <div className="w-60 overflow-hidden truncate">
              <span>{`$${(coin.holdings * coinPrice).toLocaleString(
                'en-US'
              )}`}</span>
            </div>
            <div className="flex flex-row items-center justify-center">
              <button
                disabled={showAddRow || selectedItem != null}
                onClick={() => {
                  handleRemoveCoin(coin)
                }}
                className="mr-2 h-7 w-7"
              >
                <Image
                  src="/images/svgs/cross-btn.svg"
                  alt="cross button"
                  width={20}
                  height={20}
                  className="h-full w-full object-cover object-center"
                />
              </button>
              <button
                disabled={showAddRow || selectedItem != null}
                onClick={() => {
                  setEditWallet(coin.walletName)
                  setEditHoldings(coin.holdings)
                  handleItemClick(index, coin)
                }}
                className="ml-2 h-7 w-7"
              >
                <Image
                  src="/images/svgs/edit-btn.svg"
                  alt="cross button"
                  width={20}
                  height={20}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    coinModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex items-center justify-center font-inter"
      >
        <Overlay closeCoinModal={closeCoinModal} />
        <div className="modal relative mx-8 flex w-full flex-col rounded-[1.25rem] bg-[#191C20] p-[2rem] text-white shadow-lg md:max-w-[48rem] xl:min-h-[20rem] xl:max-w-[60rem]">
          <div className="mb-[1.5rem] flex items-center justify-between">
            <h1 className="text-center text-[1.5rem] font-bold">
              {`${coinSymbol} - ${coinName}`}
            </h1>
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
          <div className="max-h-[24rem] overflow-y-auto" ref={containerRef}>
            <div className="flex w-full items-center justify-between px-[2rem] py-[1rem] text-[1.5rem]">
              <div className="w-1/3 pl-2">
                <span>Wallet</span>
              </div>
              <div className="w-1/3 pl-2">
                <span>Holdings</span>
              </div>
              <div className="w-1/3 ">
                <span>Value</span>
              </div>
            </div>
            {coinArray.length > 0
              ? coinArray.map((coin, index) =>
                  selectedItem == index
                    ? editRowComponent(coin)
                    : coinComponent(index, coin)
                )
              : !showAddRow && (
                  <div
                    className={`flex w-full items-center justify-center bg-[#191C20] px-[2rem] py-[1rem] text-center text-[1.5rem]`}
                  >
                    You have no wallets for this coin added in your portfolio.
                  </div>
                )}
            {showAddRow && addRowComponent()}
          </div>

          <div className="mt-8 flex flex-row items-center ">
            {coinArray.length > 0 && (
              <button
                disabled={selectedItem != null || showAddRow}
                onClick={handleRemoveAllCoins}
                id="btn-add-wallet"
                className={`spinner mr-2 h-[4.6rem] w-[100%] rounded-[0.5rem] border border-black bg-[#E05E28] text-center text-[1.4rem] font-[500]  ${
                  !(selectedItem != null || showAddRow)
                    ? 'hover:bg-[#D04922]'
                    : 'cursor-not-allowed opacity-50'
                }`}
              >
                REMOVE {coinSymbol}
              </button>
            )}

            <button
              disabled={selectedItem != null || showAddRow}
              onClick={handleAddCoin}
              id="btn-add-wallet"
              class={`spinner  h-[4.6rem] w-[100%] rounded-[0.5rem] border border-black bg-[#5B218F] text-center text-[1.4rem] font-[500] 
              ${
                !(selectedItem != null || showAddRow)
                  ? 'hover:bg-[#4A1A7C] '
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              ADD WALLET
            </button>
          </div>
        </div>
      </motion.div>
    )
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
