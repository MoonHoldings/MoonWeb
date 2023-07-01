export const SERVER_URL = `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}/api`
export const BEND_URL = `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}`
export const MOON_API_URL = process.env.NEXT_PUBLIC_MOON_API_URL
export const SHYFT_URL = `${process.env.NEXT_PUBLIC_SHYFT_SERVER_URL}`
export const SHYFT_KEY = `${process.env.NEXT_PUBLIC_SHYFT_KEY}`
export const HELLO_MOON_URL = `${process.env.NEXT_PUBLIC_HELLO_MOON_SERVER_URL}`
export const HELLO_MOON_KEY = `${process.env.NEXT_PUBLIC_HELLO_MOON_KEY}`
export const AXIOS_CONFIG = { headers: { 'Content-Type': 'application/json' } }
export const AXIOS_CONFIG_SHYFT_KEY = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': SHYFT_KEY,
  },
}
export const AXIOS_CONFIG_HELLO_MOON_KEY = {
  headers: {
    Authorization: `Bearer ${HELLO_MOON_KEY}`,
  },
}
export const CRYPTO_SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET
export const RPC_URL = process.env.NEXT_PUBLIC_RPC
export const HELLO_MOON_RPC_URL = `${process.env.NEXT_PUBLIC_HELLO_MOON_RPC}?apiKey=${HELLO_MOON_KEY}`
export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL
export const SUPERUSER_KEY = process.env.NEXT_PUBLIC_SUPERUSER_KEY
export const LANDING_SITE = process.env.NEXT_PUBLIC_LANDING_SITE
export const COINBASE_URL = process.env.NEXT_PUBLIC_COINBASE_URL
export const COINBASE_SECRET = process.env.NEXT_PUBLIC_COINBASE_SECRET
export const COINBASE_CLIENT = process.env.NEXT_PUBLIC_COINBASE_CLIENT
