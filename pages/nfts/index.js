import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeAddWalletModalOpen,
  changeWalletsModalOpen,
} from 'redux/reducers/utilSlice'
import Collections from 'components/nft/Collections'
import {
  ADD_WALLET_ADDRESSES,
  CONNECT_WALLET,
  PLEASE_SELECT,
  START_CONNECTING_WALLETS,
  WELCOME_MOON_HOLDINGS,
} from 'app/constants/copy'
import { getServerSidePropsWithAuth } from '../../utils/withAuth'
import { fetchUserNfts } from 'redux/reducers/walletSlice'

const Nfts = () => {
  const dispatch = useDispatch()
  const { collections } = useSelector((state) => state.wallet)

  useEffect(() => {
    dispatch(fetchUserNfts())
  }, [dispatch])

  const addWalletAddress = () => {
    dispatch(changeAddWalletModalOpen(true))
  }

  const connectWallet = () => {
    dispatch(changeWalletsModalOpen(true))
  }

  return collections.length === 0 ? (
    <div className="welcome-message mt-[10rem] text-[1.6rem] font-semibold text-white md:order-2 md:mt-[15rem]">
      <h1 className="text-[2.2rem] font-bold">{WELCOME_MOON_HOLDINGS}</h1>
      <p className="mb-[2rem]">{START_CONNECTING_WALLETS}</p>
      <p>
        {PLEASE_SELECT}{' '}
        <button
          type="button"
          onClick={connectWallet}
          className="text-[#62EAD2]"
        >
          {CONNECT_WALLET}
        </button>
        , or to connect multiple wallets{' '}
        <button
          type="button"
          className="text-[#62EAD2]"
          onClick={addWalletAddress}
        >
          {ADD_WALLET_ADDRESSES}
        </button>
        .
      </p>
    </div>
  ) : (
    <Collections collections={collections} />
  )
}

export default Nfts
export const getServerSideProps = getServerSidePropsWithAuth
