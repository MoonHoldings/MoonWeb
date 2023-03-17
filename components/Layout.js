import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

// import {
//   ConnectionProvider,
//   WalletProvider,
// } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import {
  GlowWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'

import { ContextProvider } from '../contexts/ContextProvider'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  const router = useRouter()
  const [innerWidth, setInnerWidth] = useState(0)

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    window.addEventListener('resize', windowResize)
  }, [])

  const windowResize = () => {
    setInnerWidth(window.innerWidth)
  }

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new GlowWalletAdapter(),
      new MathWalletAdapter(),
    ],
    []
  )

  const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), [])

  return (
    <>
      <ContextProvider>
        {/* <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect> */}
        {innerWidth < 600 &&
        (router.pathname === '/login' || router.pathname === '/signup') ? (
          ''
        ) : (
          <Navbar />
        )}
        <div>{children}</div>
        {/* </WalletProvider>
      </ConnectionProvider> */}
      </ContextProvider>
    </>
  )
}

export default Layout
