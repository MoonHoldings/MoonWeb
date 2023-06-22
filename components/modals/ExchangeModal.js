import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { changeExchangeModalOpen } from 'redux/reducers/utilSlice'

import { Spin, notification } from 'antd'
import { ADD_USER_COIN } from 'utils/mutations'
import { useMutation } from '@apollo/client'
import { pythCoins } from 'utils/pyth'
import { getUserWallets } from 'redux/reducers/walletSlice'
import { displayNotifModal } from 'utils/notificationModal'
import { detectCedeProvider } from '@cedelabs/providers'
import { reloadPortfolio } from 'redux/reducers/portfolioSlice'
const ExchangeModal = (props) => {
  const dispatch = useDispatch()
  const [api, contextHolder] = notification.useNotification()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { exchangeWallets } = useSelector((state) => state.wallet)
  const { tokenHeader } = useSelector((state) => state.auth)
  const [addUserCoin] = useMutation(ADD_USER_COIN, {
    fetchPolicy: 'no-cache',
    context: tokenHeader,
  })

  const closeModal = () => {
    dispatch(changeExchangeModalOpen(false))
  }

  const onSuccess = () => {
    dispatch(getUserWallets({}))
    dispatch(reloadPortfolio())
    displayNotifModal(
      'Success',
      `Done! You have successfully added your Binance Wallet.`,
      api
    )
  }
  const onSave = async (coinName, coinSymbol, balance, address, wallet) => {
    const coinData = {
      name: coinName,
      symbol: coinSymbol,
      walletName: wallet,
      type: 'Auto',
      walletAddress: address,
      holdings: parseFloat(balance),
    }

    try {
      await addUserCoin({
        variables: {
          coinData,
        },
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const connectCede = async () => {
    const fetchVaults = props.cedeProvider.getVaultPreviews()

    if (fetchVaults) {
      const binanceWallet = fetchVaults.find((obj) =>
        obj.accounts.some((account) => account.cexName === 'binance')
      )

      if (binanceWallet) {
        const matchingAccount = binanceWallet.accounts.find(
          (account) => account.cexName === 'binance'
        )

        const balanceInfo = await props.cedeProvider.request({
          method: 'balances',
          params: {
            vaultId: binanceWallet.id,
            accountNames: [matchingAccount.accountName],
          },
        })

        const coins = balanceInfo[0].balances
        const matchingCoins = coins
          .filter(
            (coin) =>
              pythCoins.some((pythCoin) => coin.token === pythCoin.symbol) &&
              coin.totalBalance > 0.00001
          )
          .map((coin) => ({
            symbol: coin.token,
            name: pythCoins.find((pythCoin) => pythCoin.symbol === coin.token)
              ?.name,
            value: coin.totalBalance,
          }))
        for (const coin of matchingCoins) {
          await onSave(
            coin.name,
            coin.symbol,
            coin.value,
            binanceWallet.id,
            matchingAccount.cexName
          )
        }
        onSuccess()
      }
    } else {
      displayNotifModal(
        'warning',
        'Vault not found. Please try again later',
        api
      )
    }
  }

  const connectBinance = async () => {
    if (props.cedeProvider == null) {
      setCurrentStep(2)
      return
    }
    try {
      setLoading(true)
      if (
        // props.cedeProvider._state.isConnected &&
        props.cedeProvider.getIsUnlocked()
      ) {
        await connectCede()
      } else {
        await props.cedeProvider.request({
          method: 'connect',
        })

        await connectCede()
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const goToCedeLabs = () => {
    const windowFeatures =
      'height=800,width=900,resizable=yes,scrollbars=yes,status=yes'
    let newWindow = window.open('', '_blank', windowFeatures)
    try {
      newWindow.location.href = 'https://cede.store/'
    } catch (error) {
      newWindow.close()
      console.log(error)
    }
  }

  const renderFirstStep = () => {
    return (
      <div className="overflow-hidden rounded-[10px] border-2 border-black text-white">
        <button
          disabled={exchangeWallets?.length > 0}
          onClick={exchangeWallets?.length > 0 ? null : connectBinance}
          className="cursor flex w-full flex-col items-center justify-center border-b-2 border-black bg-[#25282C] p-16 hover:bg-gray-800 disabled:cursor-not-allowed  disabled:bg-gray-700"
        >
          <h1 className="text-[1.8rem] font-[700] text-[#FED007] ">
            Binance {exchangeWallets?.length > 0 ? '(Connected)' : ''}{' '}
            {loading && <Spin className="ml-3" />}
          </h1>
          <p className="text-center text-[1.4rem] text-[#666666]">
            Connect and pull portfolio from Binance via Cedelabs wallet
          </p>
        </button>
        <button
          disabled
          onClick={() => {}}
          className="cursor flex w-full flex-col items-center justify-center bg-[#25282C] p-16 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          <h1 className="text-[1.8rem] font-[700] text-[#666666] ">
            Add More Exchanges
          </h1>
          <p className="text-center text-[1.4rem] text-[#666666]">
            Coinbase, Gemini, Robinhood, Fidelity, Charles Swab & more
          </p>
        </button>
      </div>
    )
  }

  const renderSecondStep = () => {
    return (
      <div className="flex flex-row overflow-hidden rounded-[10px] border-2 border-black text-white">
        <button
          onClick={() => setCurrentStep(1)}
          className="cursor flex w-full flex-col items-center justify-center border-r-2  border-black  bg-[#25282C] p-16 hover:bg-gray-800"
        >
          <h1 className="text-[1.8rem] font-[700] text-[#61DAE9] ">Go Back</h1>
          <p className="text-center text-[1.4rem] text-[#666666]">
            Click here to go back to the first menu.
          </p>
        </button>
        <button
          onClick={goToCedeLabs}
          className="cursor flex w-full flex-col items-center justify-center bg-[#25282C] p-16 hover:bg-gray-800"
        >
          <h1 className="text-[1.8rem] font-[700] text-[#61DAE9] ">
            Cede Labs
          </h1>
          <p className="text-center text-[1.4rem] text-[#666666]">
            Click here to go to Cede Labs website.
          </p>
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex items-center justify-center p-[1rem] font-inter"
    >
      <Overlay closeModal={closeModal} />
      {contextHolder}
      <div className="main-modal w-[60.5rem] rounded-[2rem] bg-[#191C20] p-[2rem] text-white drop-shadow-lg">
        <div className="top-line mb-[1rem] flex justify-between py-[1rem]">
          <h1 className="text-[1.8rem] font-[700]">Connect Exchange</h1>
          <button onClick={closeModal}>
            <Image
              className="h-[2.2rem] w-[2.2rem]"
              src="/images/svgs/x-btn.svg"
              alt="cross button"
              width={20}
              height={20}
            />
          </button>
        </div>
        {currentStep == 1 ? renderFirstStep() : renderSecondStep()}
      </div>
    </motion.div>
  )
}

const Overlay = ({ closeModal }) => {
  return (
    <div
      onClick={closeModal}
      className="absolute h-full w-full bg-[#00000099]"
    />
  )
}

export default ExchangeModal
