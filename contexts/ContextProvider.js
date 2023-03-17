import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  BackpackWalletAdapter,
  ExodusWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'
import { Get } from '../utils/solanaAdapterNetwork'
// import { AutoConnectProvider, useAutoConnect } from './AutoConnectProvider'
// import {
//   NetworkConfigurationProvider,
//   useNetworkConfiguration,
// } from './NetworkConfigurationProvider'

const WalletContextProvider = ({ children }) => {
  // const { autoConnect } = useAutoConnect()
  // const { networkConfiguration } = useNetworkConfiguration()
  // const network = networkConfiguration
  const network = 'mainnet-beta'
  console.log('network', network)
  const endpoint = useMemo(() => Get.clusterUrl(network), [network])
  console.log('endpoint', endpoint)
  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
      new ExodusWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export const ContextProvider = ({ children }) => {
  return (
    <>
      {/* <NetworkConfigurationProvider> */}
      {/* <AutoConnectProvider> */}
      <WalletContextProvider>{children}</WalletContextProvider>
      {/* </AutoConnectProvider> */}
      {/* </NetworkConfigurationProvider> */}
    </>
  )
}
