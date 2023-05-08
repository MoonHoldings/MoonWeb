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
import Header from 'components/defi-loans/Header'

const Crypto = () => {
  const dispatch = useDispatch()
  const [myCoins, setMyCoins] = useState([])
  const [isSet, setIsSet] = useState(false)

  const { coinModalOpen } = useSelector((state) => state.util)

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

  return myCoins.length > 0 ? (
    <div className="text-white md:order-2">
      <h1 className="mb-[2.6rem] text-[2.8rem]">{CRYPTO_PORTFOLIO}</h1>
      <div className="barchart flex rounded-[1rem] bg-[#1C1F25] p-[0.5rem]">
        {myCoins.map((crypto, index) => (
          <SingleBar
            crypto={crypto}
            myCoins={myCoins}
            index={index}
            key={index}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6 py-[2rem] md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 4xl:grid-cols-8">
        {myCoins.map((crypto, index) => (
          <CryptoSquare
            key={index}
            crypto={crypto}
            handleCoinClick={() => handleCoinClick(crypto)}
          />
        ))}
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
