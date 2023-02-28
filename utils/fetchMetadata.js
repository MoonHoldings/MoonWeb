import axios from 'axios'

export default async (nfts) => {
  const mappedNfts = []
  try {
    for (let i = 0; i < nfts.length; i++) {
      const response = await axios.get(`${nfts[i].metadata_uri}`)
      const res = response.data

      mappedNfts.push({ ...nfts[i], image: res.image })
    }

    return mappedNfts
  } catch (error) {
    console.error('Error: collection.js > addAddress', error)
  }
}
