import React, { useEffect, useState } from 'react'
import { CRYPTO_PORTFOLIO } from 'app/constants/copy'
import CryptoSquare from 'components/crypto/CryptoSquare'
import SingleBar from 'components/crypto/SingleBar'
import { getServerSidePropsWithAuth } from 'utils/withAuth'
import { GET_USER_PORTFOLIO, GET_USER_PORTFOLIO_BY_SYMBOL } from 'utils/queries'
import { useLazyQuery } from '@apollo/client'

import { getCoinPrices, pythCoins } from 'utils/pyth'
import {
  loadingPortfolio,
  populatePortfolioCoins,
} from 'redux/reducers/portfolioSlice'
import { useDispatch, useSelector } from 'react-redux'
import { changeCoinModalOpen } from 'redux/reducers/utilSlice'

import assetsManifest from 'cryptocurrency-icons/manifest.json'

const Crypto = () => {
  const dispatch = useDispatch()
  const [myCoins, setMyCoins] = useState([])
  const [isSet, setIsSet] = useState(false)

  const { coinModalOpen } = useSelector((state) => state.util)
  const { loading: loadingPage } = useSelector((state) => state.portfolio)

  const [getUserPort, { data: userCoins, loading: loadingUserCoins }] =
    useLazyQuery(GET_USER_PORTFOLIO, {
      fetchPolicy: 'no-cache',
    })

  const [getUserPortBySymbol] = useLazyQuery(GET_USER_PORTFOLIO_BY_SYMBOL, {
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    async function getCoinPrice() {
      if (!loadingUserCoins && userCoins && !isSet) {
        const updatedMyCoins = userCoins.getUserPortfolioCoins.map((myCoin) => {
          const userCoin = pythCoins.find(
            (coin) => coin.symbol === myCoin.symbol
          )
          if (userCoin) {
            return {
              ...myCoin,
              key: userCoin.key,
              color: userCoin.color ? userCoin.color : '#016F9E',
            }
          }
        })
        const withPrice = await getCoinPrices(updatedMyCoins)

        const coin = withPrice.map((myCoin) => {
          const userCoin = assetsManifest.find(
            (coin) => coin.symbol === myCoin.symbol
          )

          if (userCoin) {
            return {
              ...myCoin,
              svg: require(`cryptocurrency-icons/svg/color/${userCoin.symbol.toLowerCase()}.svg`),
              color: userCoin.color,
            }
          } else {
            return {
              ...myCoin,
              svg: require('cryptocurrency-icons/svg/color/generic.svg'),
              color: '#62EAD2',
            }
          }
        })
        setIsSet(true)

        setMyCoins(
          coin.sort((a, b) => b.holdings * b.price - a.holdings * a.price)
        )

        dispatch(loadingPortfolio(false))
      }
    }

    getCoinPrice()
  }, [userCoins, loadingUserCoins, isSet, myCoins, dispatch])

  useEffect(() => {
    if (!coinModalOpen) {
      dispatch(loadingPortfolio(true))
      getUserPort()
      setIsSet(false)
    }
  }, [coinModalOpen, getUserPort, dispatch])

  const handleCoinClick = async (coin) => {
    dispatch(loadingPortfolio(true))

    const res = await getUserPortBySymbol({
      variables: { symbol: coin.symbol },
    })

    dispatch(
      populatePortfolioCoins({
        coins: res.data.getUserPortfolioCoinsBySymbol,
        symbol: coin.symbol,
        name: coin.name,
        coinPrice: coin.price,
      })
    )
    dispatch(loadingPortfolio(false))
    dispatch(changeCoinModalOpen(true))
  }

  return loadingPage && myCoins.length == 0 ? (
    <div className=" h-full md:order-2">
      <div className="flex h-full items-center justify-center self-center ">
        <svg
          aria-hidden="true"
          className="mr-2 h-14 w-14 animate-spin fill-teal-400 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    </div>
  ) : myCoins.length > 0 ? (
    <div className="text-white md:order-2">
      <h1 className="mb-[2.6rem] text-[2.8rem]">{CRYPTO_PORTFOLIO}</h1>
      <div className="barchart flex flex w-full w-full rounded-[1rem] bg-[#1C1F25] p-[0.5rem]">
        {myCoins.map((crypto, index) => (
          <SingleBar
            crypto={crypto}
            myCoins={myCoins}
            index={index}
            key={index}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6 py-[2rem] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 4xl:grid-cols-8">
        {myCoins.map((crypto, index) => (
          <CryptoSquare
            loading={loadingPage}
            key={index}
            crypto={crypto}
            handleCoinClick={() => handleCoinClick(crypto)}
          />
        ))}
        {loadingPage && (
          <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <svg
              aria-hidden="true"
              className="mr-2 h-14 w-14 animate-spin fill-teal-400 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="pb-[4rem] pt-[2rem] md:order-2">
      <p className="text-[1.6rem] opacity-60">
        {'There are no coins added to your portfolio yet.'}
      </p>
    </div>
  )
}

export default Crypto
export const getServerSideProps = getServerSidePropsWithAuth
