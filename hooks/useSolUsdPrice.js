import { useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import {
  PythConnection,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from '@pythnetwork/client'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeSolUsdPrice,
  updateShouldUpdateCurrency,
  loadingCrypto,
} from 'redux/reducers/cryptoSlice'

import { useRouter } from 'next/router'

const PYTHNET_CLUSTER_NAME = 'pythnet'
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME))
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME)
// This feed ID comes from this list: https://pyth.network/developers/price-feed-ids#solana-mainnet-beta
// This example shows Crypto.SOL/USD
let feeds = [new PublicKey('JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB')]
let pythConnection
function useSolUsdPrice() {
  const dispatch = useDispatch()
  const { solUsdPrice, currentCurrency, shouldUpdateCurrency } = useSelector(
    (state) => state.crypto
  )
  const { wallets } = useSelector((state) => state.wallet)

  const router = useRouter()

  useEffect(() => {
    if (
      (router.pathname.includes('nfts') ||
        router.pathname.includes('dashboard') ||
        router.pathname.includes('crypto')) &&
      wallets?.length
    ) {
      if (pythConnection == null) {
        dispatch(loadingCrypto(true))
        pythConnection = new PythConnection(
          connection,
          pythPublicKey,
          'confirmed',
          feeds
        )

        try {
          pythConnection.onPriceChangeVerbose(
            (_productAccount, priceAccount) => {
              const price = priceAccount.accountInfo.data
              if (price.price !== solUsdPrice) {
                dispatch(changeSolUsdPrice(price.price))
                dispatch(loadingCrypto(false))
              }
            }
          )
          pythConnection.start()
        } catch (error) {
          pythConnection.stop()
          dispatch(changeSolUsdPrice(0))
          dispatch(loadingCrypto(false))
        }
      } else if (shouldUpdateCurrency) {
        dispatch(loadingCrypto(true))
        pythConnection.stop()
        pythConnection = null
        const key =
          currentCurrency == 'ETH'
            ? 'JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB'
            : currentCurrency == 'BTC'
            ? 'GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU'
            : 'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG'
        feeds = [new PublicKey(key)]
        dispatch(updateShouldUpdateCurrency(false))
      }
    }
  }, [
    dispatch,
    solUsdPrice,
    router.pathname,
    wallets,
    shouldUpdateCurrency,
    currentCurrency,
  ])

  return null
}

export default useSolUsdPrice
