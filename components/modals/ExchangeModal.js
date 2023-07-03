import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { changeExchangeModalOpen } from 'redux/reducers/utilSlice'

import { Spin } from 'antd'
import { ADD_EXCHANGE_COINS } from 'utils/mutations'
import { useMutation } from '@apollo/client'
import { pythCoins } from 'utils/pyth'
import { getUserWallets } from 'redux/reducers/walletSlice'
import { displayNotifModal } from 'utils/notificationModal'
import { reloadPortfolio } from 'redux/reducers/portfolioSlice'
import encrypt from '../../utils/encrypt'
import { coinbaseClient } from 'utils/coinbase'
import { generators } from 'openid-client'

const ExchangeModal = (props) => {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const { exchangeWallets } = useSelector((state) => state.wallet)
  const { tokenHeader, id } = useSelector((state) => state.auth)
  const [addExchangeCoins] = useMutation(ADD_EXCHANGE_COINS, {
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
      `Done! You have successfully added your Wallet.`
    )
  }
  const onSave = async (coinData, address, wallet) => {
    const exchangeInfo = {
      coinData: coinData,
      walletName: wallet,
      walletAddress: address,
    }

    try {
      await addExchangeCoins({
        variables: {
          exchangeInfo,
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

        const coinData = []
        for (const coin of matchingCoins) {
          coinData.push({
            name: coin.name,
            symbol: coin.symbol,
            walletName: matchingAccount.cexName,
            type: 'Auto',
            walletAddress: binanceWallet.id,
            holdings: parseFloat(coin.value),
          })
        }
        await onSave(coinData, binanceWallet.id, matchingAccount.cexName)
        onSuccess()
      }
    } else {
      displayNotifModal('Warning', 'Vault not found. Please try again later.')
    }
  }

  const connectBinance = async () => {
    if (props.cedeProvider == null) {
      setCurrentStep(2)
      return
    }
    try {
      setLoading(true)
      if (props.cedeProvider.getIsUnlocked()) {
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

  const connectCoinbase = async () => {
    const code_verifier = generators.codeVerifier()
    const code_challenge = generators.codeChallenge(code_verifier)
    const url = coinbaseClient.authorizationUrl({
      scope: 'wallet:accounts:read',

      code_challenge,
      code_challenge_method: 'S256',
      state: encrypt('HELLOMOON ' + id),
    })
    const windowFeatures =
      'height=800,width=900,resizable=yes,scrollbars=yes,status=yes'
    let discordWindow = window.open('', '_blank', windowFeatures)

    openDiscordWindow(url, discordWindow)
  }

  const openDiscordWindow = (discordUrl, discordWindow) => {
    discordWindow.location.href = discordUrl
    try {
      window.addEventListener('message', receiveMessage, false)
      async function receiveMessage(event) {
        const valueReceived = event.data

        if (valueReceived?.successMessage) {
          onSuccess()
          discordWindow.close()
        }
      }
    } catch (error) {
      discordWindow.close()
    }
    const intervalId = setInterval(async () => {
      if (discordWindow.closed) {
        clearInterval(intervalId)
      }
    }, 1000)
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
      <div className="flex flex-row">
        <div className="mr-2 h-auto w-full rounded-[10px] bg-black pb-2 pr-2">
          <button
            disabled={exchangeWallets.some(
              (wallet) => wallet.name === 'binance'
            )}
            onClick={
              exchangeWallets.some((wallet) => wallet.name === 'binance')
                ? null
                : connectBinance
            }
            className="cursor flex h-full w-full flex-col items-center justify-center rounded-[10px] border-2 border-black bg-[#25282C] hover:bg-gray-800 disabled:cursor-not-allowed  disabled:bg-gray-700"
          >
            <Image
              className="m-16 h-full w-[70%] "
              src="/images/svgs/binance_logo.svg"
              alt="cross button"
              width={100}
              height={100}
            />
          </button>
        </div>
        <div className="ml-2 h-auto w-full rounded-[10px] bg-black pb-2 pr-2">
          <button
            disabled={exchangeWallets.some(
              (wallet) => wallet.name === 'Coinbase'
            )}
            onClick={
              exchangeWallets.some((wallet) => wallet.name === 'Coinbase')
                ? null
                : connectCoinbase
            }
            className="cursor flex h-full w-full flex-col items-center justify-center rounded-[10px] border-2 border-black bg-[#25282C] hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            <Image
              className="m-16 h-full w-[70%]"
              src="/images/svgs/coinbase_logo.svg"
              alt="cross button"
              width={100}
              height={100}
            />
          </button>
        </div>
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
