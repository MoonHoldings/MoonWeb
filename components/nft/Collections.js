import React from 'react'
import CollectionCard from './CollectionCard'
import { NFT_PORTFOLIO } from 'application/constants/copy'
import TextBlink from 'components/partials/TextBlink'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import { useSelector } from 'react-redux'
import NftPortfolioChart from 'components/NftPortfolioChart'
import { useQuery } from '@apollo/client'
import { GET_USER_DASHBOARD_TIMESERIES } from 'utils/queries'
import { format } from 'date-fns'

const Collections = ({ collections }) => {
  const { tokenHeader } = useSelector((state) => state.auth)
  const { solUsdPrice, selectedCurrencyPrice, currentCurrency } = useSelector(
    (state) => state.crypto
  )

  const { data, loading, refetch } = useQuery(GET_USER_DASHBOARD_TIMESERIES, {
    variables: {
      type: 'nft',
      timeRangeType: 'week',
    },
    context: tokenHeader,
    fetchPolicy: 'no-cache',
  })
  const timeSeries =
    data?.getTimeSeries?.map((data) => ({
      time: format(new Date(data.createdAt), 'yyyy-MM-dd'),
      value: data.total,
    })) ?? []

  const totalNftCount = collections?.reduce(
    (total, col) => total + col.nfts?.length,
    0
  )

  const sortedCollections = collections
    ? [...collections]?.sort(
        (a, b) =>
          b?.floorPrice * b?.nfts?.length - a?.floorPrice * a?.nfts?.length
      )
    : []

  const calculatePortfolioValue = () => {
    return collections?.reduce((total, c) => {
      if (c.floorPrice) {
        const value =
          (parseFloat(c.floorPrice) / LAMPORTS_PER_SOL) * c?.nfts?.length
        return total + value
      }
      return total
    }, 0)
  }

  const nftTotalValue = calculatePortfolioValue()

  return (
    <div className="nft-portfolio mt-[2rem] text-white md:order-2">
      <div className="flex w-[50%] flex-row">
        <NftPortfolioChart
          data={timeSeries}
          loading={loading}
          refetch={(timeRangeType) => refetch({ type: 'nft', timeRangeType })}
        />
      </div>
      <h1 className="text-[2.9rem]">{NFT_PORTFOLIO}</h1>
      <p className=" text-[1.6rem]">
        You have <u>{collections?.length}</u> collections containing{' '}
        <u>{totalNftCount}</u> NFTs
      </p>
      {collections && (
        <div className="mt-8 flex hidden items-center justify-start  max-[1279px]:block">
          <div className="flex items-center">
            <div className="bold flex items-center text-center text-[1.5rem] md:text-[2rem]">
              Total Value:
              <div className="ml-2 flex items-center text-[#62EAD2] md:ml-4">
                {toCurrencyFormat(
                  (nftTotalValue * solUsdPrice) / selectedCurrencyPrice
                )}
                {currentCurrency === 'BTC'
                  ? ' ₿'
                  : currentCurrency == 'ETH'
                  ? ' Ξ'
                  : ' ◎'}
              </div>
            </div>
            <div>
              <TextBlink
                className="bold ml-4 text-[1.5rem] text-[#62EAD2] md:text-[2rem]"
                text={`$${toCurrencyFormat(nftTotalValue * solUsdPrice)}`}
              />
            </div>
          </div>
        </div>
      )}

      <div className="h grid grid-cols-2 gap-6 py-[2rem] xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 4xl:grid-cols-8">
        {sortedCollections?.map((col, index) => (
          <CollectionCard key={index} index={index} collection={col} />
        ))}
      </div>
    </div>
  )
}

export default Collections
