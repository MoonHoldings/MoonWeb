import { useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import {
  PythConnection,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from '@pythnetwork/client'
import { useDispatch, useSelector } from 'react-redux'
import { changeSolUsdPrice } from 'redux/reducers/cryptoSlice'
import { useRouter } from 'next/router'

const PYTHNET_CLUSTER_NAME = 'pythnet'
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME))
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME)
// This feed ID comes from this list: https://pyth.network/developers/price-feed-ids#solana-mainnet-beta
// This example shows Crypto.SOL/USD
const feeds = [new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG')]

function useSolUsdPrice() {
  const dispatch = useDispatch()
  const { solUsdPrice } = useSelector((state) => state.crypto)
  const { wallets } = useSelector((state) => state.wallet)
  const router = useRouter()

  useEffect(() => {
    if (
      (router.pathname.includes('nfts') ||
        router.pathname.includes('dashboard') ||
        router.pathname.includes('crypto')) &&
      wallets.length
    ) {
      const pythConnection = new PythConnection(
        connection,
        pythPublicKey,
        'confirmed',
        feeds
      )

      pythConnection.onPriceChangeVerbose((_productAccount, priceAccount) => {
        const price = priceAccount.accountInfo.data

        if (price.price !== solUsdPrice) {
          dispatch(changeSolUsdPrice(price.price))
        }
      })

      pythConnection.start()

      return () => {
        pythConnection.stop()
      }
    }
  }, [dispatch, solUsdPrice, router.pathname, wallets])

  return null
}

export default useSolUsdPrice
