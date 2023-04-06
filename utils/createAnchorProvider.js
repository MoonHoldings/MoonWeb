import { AnchorProvider } from '@project-serum/anchor'

import { Connection, Keypair } from '@solana/web3.js'
import { RPC_URL } from 'app/constants/api'

const createAnchorProvider = () => {
  const provider = new AnchorProvider(
    new Connection(RPC_URL, 'confirmed'),
    { publicKey: Keypair.generate().publicKey },
    {
      maxRetries: 2,
    }
  )

  // const provider = new AnchorProvider(
  //   new Connection(RPC_URL, {
  //     httpHeaders: {
  //       Authorization: `Bearer ${HELLO_MOON_KEY}`,
  //     },
  //   }),
  //   { publicKey: Keypair.generate().publicKey },
  //   {
  //     maxRetries: 2,
  //   }
  // )

  provider.connection._confirmTransactionInitialTimeout = 180_000

  return provider
}

export default createAnchorProvider
