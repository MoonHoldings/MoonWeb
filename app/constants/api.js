export const SERVER_URL = `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}/api`
export const SHYFT_URL = `${process.env.NEXT_PUBLIC_SHYFT_SERVER_URL}`
export const SHYFT_KEY = `${process.env.NEXT_PUBLIC_SHYFT_KEY}`
export const AXIOS_CONFIG = { headers: { 'Content-Type': 'application/json' } }
export const AXIOS_CONFIG_SHYFT_KEY = {
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': SHYFT_KEY,
  },
}
