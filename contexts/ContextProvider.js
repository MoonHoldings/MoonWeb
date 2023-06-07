import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  BackpackWalletAdapter,
  ExodusWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'
import { Get } from '../utils/solanaAdapterNetwork'

const WalletContextProvider = ({ children }) => {
  const network = 'devnet'
  const endpoint = useMemo(() => Get.clusterUrl(network), [network])

  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
      new ExodusWalletAdapter(),
      new GlowWalletAdapter(),
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
  return <WalletContextProvider>{children}</WalletContextProvider>
}
