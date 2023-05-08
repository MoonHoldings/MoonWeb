import {
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from '@pythnetwork/client'
import { Connection, PublicKey } from '@solana/web3.js'

const PYTHNET_CLUSTER_NAME = 'pythnet'
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME))
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME)

const pythClient = new PythHttpClient(connection, pythPublicKey)

export async function getCoinPrice(pythKey) {
  const key = new PublicKey(pythKey)
  const assetPrices = []
  const data = await pythClient.getAssetPricesFromAccounts([key])
  for (const symbol of data) {
    assetPrices.push(symbol.price)
  }

  return assetPrices
}

export async function getCoinPrices(pythKeys) {
  const assetPrices = []

  const newArray = pythKeys.map((obj) => {
    return new PublicKey(obj.key)
  })

  const data = await pythClient.getAssetPricesFromAccounts(newArray)

  for (const symbol of data) {
    assetPrices.push(symbol.price)
  }

  return assetPrices
}

export const pythCoins = [
  {
    symbol: 'ALGO',
    name: 'Algorand',
    key: 'HqFyq1wh1xKvL7KDqqT7NJeSPdAqsDqnmBisUC2XdXAX',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    key: '3pyn4svBbxJ9Wnn3RVeafyLWfzie6yC5eTig2S62v9SC',
  },
  {
    symbol: 'APT',
    name: 'Apidae',
    key: 'FNNvb1AFDnDVPkocEri8mWbJ1952HQZtFLuwPiUjSJQ',
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    key: '3wDLxH34Yz8tGjwHszQ2MfzHwRoaQgKA32uq2bRpjJBW',
  },
  {
    symbol: 'APE',
    name: 'ApeCoin',
    key: '2TdKEvPTKpDtJo6pwxd79atZFQNWiSUT2T47nF9j5qFy',
  },
  {
    symbol: 'ATLAS',
    name: 'Atlantis',
    key: '81Rz3i7MC9nHYo1vQg6kJM5hepjqb63Y1gnr3AkrD36D',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    key: 'Ax9ujW5B9oqcv59N8m6f1BpTBq2rGeGaBcpKjC5UYsXU',
  },

  {
    symbol: 'ARB',
    name: 'Arbitrum',
    key: '5HRrdmghsnU3i2u5StaKaydS7eq3vnKVKwXMzCNKsc4C',
  },
  {
    symbol: 'ATOM',
    name: 'Cosmos Hub',
    key: 'CrCpTerNqtZvqLcKqz1k13oVeXV9WkMD2zA9hBKXrsbN',
  },

  {
    symbol: 'BNB',
    name: 'BNB',
    key: '4CkQJBxhU8EZ2UjhigbtdaPbpTe6mqf811fipYBFbSYN',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    key: 'GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU',
    color: '#F7931A',
  },

  {
    symbol: 'BCH',
    name: 'Binance-Peg Bitcoin Cash',
    key: '5ALDzwcRJfSyGdGyhP3kP628aqBNHZzLuVww7o9kdspe',
  },
  {
    symbol: 'BAT',
    name: 'Basic Attention',
    key: 'AbMTYZ82Xfv9PtTQ5e1fJXemXjzqEEFHP3oDLRTae6yz',
  },
  {
    symbol: 'BLUR',
    name: 'Blur',
    key: '9yoZqrXpNpP8vfE7XhN3jPxzALpFA8C5Nvs1RNXQigCQ',
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    key: '8ihFLu5FimgTQ1Unh4dVyEHUGodJ5gJQCrQf4KUVB9bN',
  },

  {
    symbol: 'BUSD',
    name: 'Binance USD',
    key: '7BHyT7XPMSA6LHYTgDTaeTPe3KTkKibMXZNxF5kiVsw1',
  },

  {
    symbol: 'C98',
    name: 'Coin98',
    key: '45rTB9ezDcTX5tMZx2uJUBbBEqAWDhXykYbBfaSWUXvD',
  },
  { symbol: 'DAR', name: 'Mines of Dalarnia' },
  { symbol: 'DYDX', name: 'dYdX' },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    key: 'EcV1X1gY2yb4KXxjVQtTHTbioum2gvmPnFk4zYAt7zne',
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    key: 'CtJ8EkqLmeYyGB8s4jevpeNsvmD4dxVR2krfsDLcvV8Y',
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    key: 'FsSM3s38PX9K7Dn6eGzuE29S2Dsk1Sss1baytTQdCaQj',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    key: 'JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB',
    color: '#016F9E',
  },

  {
    symbol: 'FTT',
    name: 'FTX',
    key: '8JPJJkmDScpcNmBRKGZuPuG2GYAveQgP3t5gFuMymwvF',
  },

  {
    symbol: 'FIDA',
    name: 'Bonfida',
    key: 'ETp9eKXVv1dWwHSpsXRUuXHmw24PwRkttCGVgpZEY9zF',
  },
  {
    symbol: 'GMT',
    name: 'Gomining Token',
    key: 'DZYZkJcFJThN9nZy4nK3hrHra1LaWeiyoZ9SMdLFEFpY',
  },

  {
    symbol: 'HNT',
    name: 'Helium',
    key: '7moA1i5vQUpfDwSpK6Pw9s56ahB7WFGidtbL2ujWrVvm',
  },

  {
    symbol: 'INJ',
    name: 'Injective',
    key: '9EdtbaivHQYA4Nh3XzGR6DwRaoorqXYnmpfsnFhvwuVj',
  },

  {
    symbol: 'LUNC',
    name: 'Terra Classic (Wormhole)',
    key: '5bmWuR1dgP4avtGYMNKLuxumZTVKGgoN2BCMXWDNL9nY',
  },

  {
    symbol: 'LDO',
    name: 'Lido DAO',
    key: 'ELrhqYY3WjLRnLwWt3u7sMykNc87EScEAsyCyrDDSAXv',
  },

  {
    symbol: 'LTC',
    name: 'Binance-Peg Litecoin',
    key: '8RMnV1eD55iqUFJLMguPkYBkq8DCtx81XcmAja93LvRR',
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    key: '7KVswB9vkCgeM3SHP7aGDijvdRAHK8P5wi9JXViCrtYh',
  },

  {
    symbol: 'MSOL',
    name: 'Marinade staked SOL',
    key: 'E4v1BBgoso9s64TQvmyownAVJbhbEPGyzA3qn4n46qj9',
  },
  {
    symbol: 'MNGO',
    name: 'Mango',
    key: '79wm3jjcPr6RaNQ4DGvP5KxG1mNd3gEBsg6FsNVFezK4',
  },

  {
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    key: 'ECSFWQ1bnnpqPVvoy9237t2wddZAaHisW88mYxuEHKWf',
  },
  {
    symbol: 'ORCA',
    name: 'Orca',
    key: '4ivThkX8uRxBpHsdWSqyXYihzKF3zpRGAUCqyuagnLoV',
  },
  {
    symbol: 'OP',
    name: 'Optimism',
    key: '4o4CUwzFwLqCvmA5x1G4VzoZkAhAcbiuiYyjWX1CVbY2',
  },

  {
    symbol: 'PORT',
    name: 'PackagePortal',
    key: 'jrMH4afMEodMqirQ7P89q5bGNJxD8uceELcsZaVBDeh',
  },

  {
    symbol: 'RAY',
    name: 'Raydium',
    key: 'AnLf8tVYCM816gmBjiy8n53eXKKEDydT5piYjjQDPgTB',
  },

  {
    symbol: 'SBR',
    name: 'Saber',
    key: '8Td9VML1nHxQK6M8VVyzsHo32D7VBk72jSpa9U861z2A',
  },
  {
    symbol: 'SCNSOL',
    name: 'Socean Staked Sol',
    key: '25yGzWV5okF7aLivSCE4xnjVUPowQcThhhx5Q2fgFhkm',
  },
  {
    symbol: 'SRM',
    name: 'Serum',
    key: '3NBReDRTLKMQEKiLD5tGcx4kXbTf88b7f2xLS9UuGjym',
  },
  {
    symbol: 'SUI',
    name: 'Sui',
    key: '3Qub3HaAJaa2xNY7SUqPKd3vVwTqDfDDkEUMPjXD2c1q',
  },

  {
    symbol: 'STSOL',
    name: 'Lido Staked SOL',
    key: 'Bt1hEbY62aMriY1SyQqbeZbm8VmSbQVGBFzSzMuVNWzN',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    key: 'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG',
    color: '#BC12EC',
  },

  {
    symbol: 'SLND',
    name: 'Solend',
    key: 'HkGEau5xY1e8REXUFbwvWWvyJGywkgiAZZFpryyraWqJ',
  },
  {
    symbol: 'SNY',
    name: 'Synthetify',
    key: 'BkN8hYgRjhyH5WNBQfDV73ivvdqNKfonCMhiYVJ1D9n9',
  },

  {
    symbol: 'USTC',
    name: 'TerraClassicUSD',
    key: 'H8DvrfSaRfUyP1Ytse1exGf7VSinLWtmKNNaBhA4as9P',
  },
  {
    symbol: 'USDC',
    name: 'Force Bridge USDC',
    key: 'Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD',
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    key: '3vxLXJqLqF3JG5TCbYycbKWRBbCJQLxQmBGCkyqEEefL',
  },

  {
    symbol: 'ZBC',
    name: 'Zebec Protocol',
    key: '3bNH7uDsap5nzwhCvv98i7VshjMagtx1NXTDBLbPYD66',
  },
]

// export const pythCoins = [
//   { asset: '1INCH', price: '$0.46155' },
//   { asset: 'ALICE', price: '$1.52988' },
//   { asset: 'AMP', price: '$0.00342' },
//   { asset: 'ACM', price: '$3.04325' },
//   { asset: 'ASR', price: '$2.96500' },
//   { asset: 'ALGO', price: '$0.17771' },
//   { asset: 'AURORA', price: '$0.15947' },
//   { asset: 'ADA', price: '$0.39000' },
//   { asset: 'APT', price: '$10.05741' },
//   { asset: 'AXS', price: '$7.72542' },
//   { asset: 'ATM', price: '$2.99715' },
//   { asset: 'ALPACA', price: '$0.25513' },
//   { asset: 'AAVE', price: '$69.24940' },
//   { asset: 'ANC', price: '$0.01399' },
//   { asset: 'APE', price: '$3.84936' },
//   { asset: 'ATLAS', price: '$0.00282' },
//   { asset: 'AVAX', price: '$16.91887' },
//   { asset: 'ANKR', price: '$0.03022' },
//   { asset: 'ARG', price: '$0.95504' },
//   { asset: 'ARB', price: '$1.33653' },
//   { asset: 'ATOM', price: '$11.24500' },
//   { asset: 'BAL', price: '$5.89984' },
//   { asset: 'BETH', price: '$1838.41555' },
//   { asset: 'BNX', price: '$0.57506' },
//   { asset: 'BNB', price: '$333.97676' },
//   { asset: 'BTC', price: '$28468.00250' },
//   { asset: 'BIT', price: '$0.49280' },
//   { asset: 'BCH', price: '$116.80000' },
//   { asset: 'BAT', price: '$0.24042' },
//   { asset: 'BLUR', price: '$0.67255' },
//   { asset: 'BONK', price: '$0.00000' },
//   { asset: 'BAR', price: '$4.14100' },
//   { asset: 'BUSD', price: '$1.00000' },
//   { asset: 'CVX', price: '$5.07834' },
//   { asset: 'CUSD', price: '$0.99576' },
//   { asset: 'CRO', price: '$0.07114' },
//   { asset: 'CITY', price: '$6.64365' },
//   { asset: 'CAKE', price: '$2.62118' },
//   { asset: 'CRV', price: '$0.89785' },
//   { asset: 'CELO', price: '$0.58385' },
//   { asset: 'CHZ', price: '$0.12377' },
//   { asset: 'CHR', price: '$0.15103' },
//   { asset: 'CBETH', price: '$1890.57000' },
//   { asset: 'C98', price: '$0.23225' },
//   { asset: 'DAR', price: '$0.16550' },
//   { asset: 'DYDX', price: '$2.52798' },
//   { asset: 'DOT', price: '$5.84330' },
//   { asset: 'DAI', price: '$0.99985' },
//   { asset: 'DOGE', price: '$0.07896' },
//   { asset: 'ETH', price: '$1849.24000' },
//   { asset: 'FXS', price: '$7.58441' },
//   { asset: 'FTM', price: '$0.41666' },
//   { asset: 'FTT', price: '$1.49792' },
//   { asset: 'FET', price: '$0.32426' },
//   { asset: 'FLOKI', price: '$0.00003' },
//   { asset: 'FLOW', price: '$0.87808' },
//   { asset: 'FIL', price: '$5.36537' },
//   { asset: 'FIDA', price: '$0.38937' },
//   { asset: 'GMT', price: '$0.32499' },
//   { asset: 'GMX', price: '$71.53503' },
//   { asset: 'GALA', price: '$0.03801' },
//   { asset: 'GAL', price: '$1.73954' },
//   { asset: 'HNT', price: '$1.75575' },
//   { asset: 'HFT', price: '$0.58520' },
//   { asset: 'INTER', price: '$2.85846' },
//   { asset: 'INJ', price: '$7.74714' },
//   { asset: 'JST', price: '$0.02583' },
//   { asset: 'JUV', price: '$3.12389' },
//   { asset: 'LUNC', price: '$0.00011' },
//   { asset: 'LINK', price: '$6.99259' },
//   { asset: 'LUNA', price: '$1.24482' },
//   { asset: 'LDO', price: '$2.02241' },
//   { asset: 'LAZIO', price: '$2.88500' },
//   { asset: 'LTC', price: '$87.55000' },
//   { asset: 'MATIC', price: '$0.98328' },
//   { asset: 'MBOX', price: '$0.50258' },
//   { asset: 'MSOL', price: '$24.73435' },
//   { asset: 'MNGO', price: '$0.01748' },
//   { asset: 'MIR', price: '$0.07333' },
//   { asset: 'NEAR', price: '$1.91106' },
//   { asset: 'ORCA', price: '$0.76131' },
//   { asset: 'OP', price: '$2.13950' },
//   { asset: 'OG', price: '$10.37350' },
//   { asset: 'OSMO', price: '$0.74876' },
//   { asset: 'ONE', price: '$0.01926' },
//   { asset: 'PORT', price: '$0.01945' },
//   { asset: 'PSG', price: '$5.43090' },
//   { asset: 'PERP', price: '$0.65818' },
//   { asset: 'PORTO', price: '$2.82050' },
//   { asset: 'RACA', price: '$0.00018' },
//   { asset: 'RAY', price: '$0.23151' },
//   { asset: 'SWEAT', price: '$0.00833' },
//   { asset: 'SBR', price: '$0.00094' },
//   { asset: 'SCNSOL', price: '$24.77749' },
//   { asset: 'SRM', price: '$0.11892' },
//   { asset: 'SANTOS', price: '$4.86219' },
//   { asset: 'SNX', price: '$2.40000' },
//   { asset: 'STSOL', price: '$24.55530' },
//   { asset: 'SOL', price: '$22.34083' },
//   { asset: 'SUN', price: '$0.00581' },
//   { asset: 'SHIB', price: '$0.00001' },
//   { asset: 'SLND', price: '$0.40156' },
//   { asset: 'SNY', price: '$0.00725' },
//   { asset: 'SPELL', price: '$0.00067' },
//   { asset: 'THETA', price: '$0.98222' },
//   { asset: 'TLM', price: '$0.01873' },
//   { asset: 'TUSD', price: '$1.00608' },
//   { asset: 'TWT', price: '$1.15855' },
//   { asset: 'USTC', price: '$0.02011' },
//   { asset: 'USDC', price: '$0.99985' },
//   { asset: 'USDT', price: '$1.00035' },
//   { asset: 'UNI', price: '$5.38491' },
//   { asset: 'WOO', price: '$0.26305' },
//   { asset: 'XMR', price: '$153.29854' },
//   { asset: 'XVS', price: '$6.13025' },
//   { asset: 'ZBC', price: '$0.01682' },
// ]

// const axios = require('axios')

// export const pythCoins = [
// {
//   symbol: '1INCH',
//   name: '1inch',
// },
// { symbol: 'ALICE', name: 'My Neighbor Alice' },
// { symbol: 'AMP', name: 'Amp' },
// { symbol: 'ACM', name: 'AC Milan Fan Token' },
// { symbol: 'ASR', name: 'AS Roma Fan Token' },
// { symbol: 'ALGO', name: 'Algorand' },
// { symbol: 'AURORA', name: 'Aurora' },
//   {
//     symbol: 'ADA',
//     name: 'Cardano',
//     key: '3pyn4svBbxJ9Wnn3RVeafyLWfzie6yC5eTig2S62v9SC',
//   },
//   // { symbol: 'APT', name: 'Apidae' },
//   // { symbol: 'AXS', name: 'Axie Infinity' },
//   // { symbol: 'ATM', name: 'Atletico Madrid Fan Token' },
//   // { symbol: 'ALPACA', name: 'Alpaca Finance' },
//   {
//     symbol: 'AAVE',
//     name: 'Aave',
//     key: '3wDLxH34Yz8tGjwHszQ2MfzHwRoaQgKA32uq2bRpjJBW',
//   },
//   { symbol: 'ANC', name: 'Anchor Protocol' },
//   { symbol: 'APE', name: 'ApeCoin' },
//   { symbol: 'ATLAS', name: 'Atlantis' },
//   { symbol: 'AVAX', name: 'Avalanche' },
//   { symbol: 'ANKR', name: 'Ankr Network' },
//   { symbol: 'ARG', name: 'Argentine Football Association Fan Token' },
//   { symbol: 'ARB', name: 'Arbitrum' },
//   { symbol: 'ATOM', name: 'Cosmos Hub' },
//   { symbol: 'BAL', name: 'Balancer' },
//   { symbol: 'BETH', name: 'Binance ETH staking' },
//   { symbol: 'BNX', name: 'BinaryX [OLD]' },
//   { symbol: 'BNB', name: 'BNB' },
//   { symbol: 'BTC', name: 'Bitcoin' },
//   { symbol: 'BIT', name: 'Biconomy Exchange' },
//   { symbol: 'BCH', name: 'Binance-Peg Bitcoin Cash' },
//   { symbol: 'BAT', name: 'Basic Attention' },
//   { symbol: 'BLUR', name: 'Blur' },
//   { symbol: 'BONK', name: 'Bonk' },
//   { symbol: 'BAR', name: 'FC Barcelona Fan Token' },
//   { symbol: 'BUSD', name: 'Binance USD' },
//   { symbol: 'CVX', name: 'Convex Finance' },
//   { symbol: 'CUSD', name: 'Celo Dollar' },
//   { symbol: 'CRO', name: 'Cronos' },
//   { symbol: 'CITY', name: 'Manchester City Fan Token' },
//   { symbol: 'CAKE', name: 'PancakeSwap' },
//   { symbol: 'CRV', name: 'Curve DAO' },
//   { symbol: 'CELO', name: 'Celo' },
//   { symbol: 'CHZ', name: 'Chiliz' },
//   { symbol: 'CHR', name: 'Chromia' },
//   { symbol: 'CBETH', name: 'Coinbase Wrapped Staked ETH' },
//   { symbol: 'C98', name: 'Coin98' },
//   { symbol: 'DAR', name: 'Mines of Dalarnia' },
//   { symbol: 'DYDX', name: 'dYdX' },
//   { symbol: 'DOT', name: 'Binance-Peg Polkadot' },
//   { symbol: 'DAI', name: 'Dai' },
//   { symbol: 'DOGE', name: 'Binance-Peg Dogecoin' },
//   { symbol: 'ETH', name: 'Ethereum' },
//   { symbol: 'FXS', name: 'Frax Share' },
//   { symbol: 'FTM', name: 'Fantom' },
//   { symbol: 'FTT', name: 'FTX' },
//   { symbol: 'FET', name: 'Fetch.ai' },
//   { symbol: 'FLOKI', name: 'Baby Moon Floki' },
//   { symbol: 'FLOW', name: 'Flow' },
//   { symbol: 'FIL', name: 'Binance-Peg Filecoin' },
//   { symbol: 'FIDA', name: 'Bonfida' },
//   { symbol: 'o', name: 'Gomining Token' },
//   { symbol: 'GMX', name: 'GMX' },
//   { symbol: 'GALA', name: 'GALA' },
//   { symbol: 'GAL', name: 'Galatasaray Fan Token' },
//   { symbol: 'HNT', name: 'Helium' },
//   { symbol: 'HFT', name: 'Hashflow' },
//   { symbol: 'INTER', name: 'InteractWith' },
//   { symbol: 'INJ', name: 'Injective' },
//   { symbol: 'JST', name: 'JUST' },
//   { symbol: 'JUV', name: 'Juventus Fan Token' },
//   { symbol: 'LUNC', name: 'Terra Classic (Wormhole)' },
//   { symbol: 'LINK', name: 'Chainlink' },
//   { symbol: 'LUNA', name: 'Terra' },
//   { symbol: 'LDO', name: 'Lido DAO' },
//   { symbol: 'LAZIO', name: 'Lazio Fan Token' },
//   { symbol: 'LTC', name: 'Binance-Peg Litecoin' },
//   { symbol: 'MATIC', name: 'Polygon' },
//   { symbol: 'MBOX', name: 'Mobox' },
//   { symbol: 'MSOL', name: 'Marinade staked SOL' },
//   { symbol: 'MNGO', name: 'Mango' },
//   { symbol: 'MIR', name: 'Mirror Protocol' },
//   { symbol: 'NEAR', name: 'NEAR Protocol' },
//   { symbol: 'ORCA', name: 'Orca' },
//   { symbol: 'OP', name: 'Optimism' },
//   { symbol: 'OG', name: 'OG Fan Token' },
//   { symbol: 'OSMO', name: 'Osmosis' },
//   { symbol: 'ONE', name: 'Harmony' },
//   { symbol: 'PORT', name: 'PackagePortal' },
//   { symbol: 'PSG', name: 'Paris Saint-Germain Fan Token' },
//   { symbol: 'PERP', name: 'Perpetual Protocol' },
//   { symbol: 'PORTO', name: 'FC Porto' },
//   { symbol: 'RACA', name: 'Radio Caca' },
//   { symbol: 'RAY', name: 'Raydium' },
//   { symbol: 'SWEAT', name: 'Sweatcoin (Sweat Economy)' },
//   { symbol: 'SBR', name: 'Saber' },
//   { symbol: 'SCNSOL', name: 'Socean Staked Sol' },
//   { symbol: 'SRM', name: 'Serum' },
//   { symbol: 'SANTOS', name: 'Santos FC Fan Token' },
//   { symbol: 'SNX', name: 'Synthetix Network' },
//   { symbol: 'STSOL', name: 'Lido Staked SOL' },
//   { symbol: 'SOL', name: 'Solana' },
//   { symbol: 'SUN', name: 'Sun Token' },
//   { symbol: 'SHIB', name: 'Shiba Inu' },
//   { symbol: 'SLND', name: 'Solend' },
//   { symbol: 'SNY', name: 'Synthetify' },
//   { symbol: 'SPELL', name: 'Spell' },
//   { symbol: 'THETA', name: 'Theta Network' },
//   { symbol: 'TLM', name: 'Alien Worlds' },
//   { symbol: 'TUSD', name: 'TrueUSD' },
//   { symbol: 'TWT', name: 'Trust Wallet' },
//   { symbol: 'USTC', name: 'TerraClassicUSD' },
//   { symbol: 'USDC', name: 'Force Bridge USDC' },
//   { symbol: 'USDT', name: 'Tether' },
//   { symbol: 'UNI', name: 'UNICORN' },
//   { symbol: 'WOO', name: 'WOO Network' },
//   { symbol: 'XMR', name: 'Monero' },
//   { symbol: 'XVS', name: 'Venus' },
//   { symbol: 'ZBC', name: 'Zebec Protocol' },
// ]

// export async function getCoinName() {
// try {
// const response = await axios.get(
//   `https://api.coingecko.com/api/v3/coins/list`
// )
// // const coin = response.data.find((c) => c.symbol === assetSymbol.toLowerCase())
// const assets = pythCoins.map((coin) => coin.asset)
// console.log(response)
// const coin = response.data
// const array = []
// for (const symbol of assets) {
//   const test = coin.find((c) => c.symbol === symbol.toLowerCase())
//   array.push({
//     symbol: symbol,
//     name: test.name,
//   })
// }
// console.log(array)
// console.log(response)
// return response.data.name
// } catch (error) {
// console.error(error)
//   }
// }

// Example usage

// for (const symbol of data) {
//   console.log(symbol.price)
//   const price = data.productPrice.get(symbol)
//   if (price.price && price.confidence && symbol.includes('Crypto')) {
//     const cleanedSymbolString = symbol.replace(/^Crypto\.|\s*\/USD$/gi, '')
//     cryptoSymbols.push({
//       asset: cleanedSymbolString,
//       price: `$${price.price.toFixed(5)}`,
//     })
//     cryptoSymbols.sort((a, b) => {
//       const firstLetterA = a.asset.charAt(0)
//       const firstLetterB = b.asset.charAt(0)

//       if (firstLetterA < firstLetterB) {
//         return -1
//       } else if (firstLetterA > firstLetterB) {
//         return 1
//       } else {
//         return 0
//       }
//     })
//   }
// }
