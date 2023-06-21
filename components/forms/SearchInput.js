import { useLazyQuery } from '@apollo/client'
import { useState, useMemo } from 'react'
import mergeClasses from 'utils/mergeClasses'
import { pythCoins } from 'utils/pyth'
import { GET_USER_PORTFOLIO_BY_SYMBOL } from 'utils/queries'
import {
  populatePortfolioCoins,
  loadingPortfolio,
} from 'redux/reducers/portfolioSlice'
import { changeCoinModalOpen } from 'redux/reducers/utilSlice'
import { useDispatch, useSelector } from 'react-redux'

export const SearchInput = (props) => {
  const dispatch = useDispatch()
  const [isFocused, setIsFocused] = useState(false)
  const [filter, setFilter] = useState('')

  const { tokenHeader } = useSelector((state) => state.auth)

  const [getUserPort] = useLazyQuery(GET_USER_PORTFOLIO_BY_SYMBOL, {
    fetchPolicy: 'no-cache',
    context: tokenHeader,
  })

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false)
    }, 200)
  }

  const handleCoinClick = async (coin) => {
    setFilter(`${coin.symbol} - ${coin.name}`)

    dispatch(loadingPortfolio(true))
    const res = await getUserPort({
      variables: { symbol: coin.symbol },
    })

    try {
      dispatch(
        populatePortfolioCoins({
          coins: res.data.getUserPortfolioCoinsBySymbol.coins,
          symbol: coin.symbol,
          name: coin.name,
          coinPrice: res.data.getUserPortfolioCoinsBySymbol.price,
        })
      )
    } catch (error) {}
    dispatch(loadingPortfolio(false))
    dispatch(changeCoinModalOpen(true))
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 8) {
    }
  }

  const filteredCoins = useMemo(() => {
    if (!filter) return pythCoins
    return pythCoins.filter(
      (coin) =>
        coin.symbol.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
        coin.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    )
  }, [filter])

  return (
    <div className="relative mb-[1rem] flex h-[5.8rem] bg-transparent">
      <label className="absolute inset-y-0 left-0 mr-4 flex items-center pl-4 focus-within:text-teal-200">
        <svg
          className={mergeClasses(
            'h-10',
            'w-10',
            isFocused ? 'text-teal-200' : 'text-white'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.873-4.873M14.382 9.764a5.5 5.5 0 11-7.778 0 5.5 5.5 0 017.778 0z"
          />
        </svg>
      </label>
      <input
        disabled={props.loading}
        className={`text-14px block h-full w-full appearance-none rounded-xl border border-black bg-gray-900 pl-16 pt-2 placeholder-white focus:text-teal-200 focus:placeholder-teal-200 focus:outline-none focus:ring-1 focus:ring-teal-200 ${
          props.loading ? 'opacity-50' : ''
        }`}
        type="text"
        placeholder="Search Coins"
        value={filter === '' ? '' : filter}
        onChange={(e) => setFilter(e.target.value)}
        onClick={() => setFilter('')}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {isFocused && filteredCoins.length > 0 && (
        <div className="absolute left-0 top-full z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-b-xl bg-gray-900 shadow-lg">
          <ul className="py-2">
            {filteredCoins.map((coin) => (
              <li
                onClick={() => {
                  handleCoinClick(coin)
                }}
                className="cursor-pointer px-4 py-3 text-teal-200 hover:bg-gray-800"
                key={coin.symbol}
              >
                {coin.symbol} - {coin.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
