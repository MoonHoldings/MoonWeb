import axios from 'axios'

let fetchRes = null

export default async (nfts) => {
  const invalidNFTs = []

  for (const nft of nfts) {
    const invalidNFT = await checkNFTValidity(nft)
    if (invalidNFT) invalidNFTs.push(invalidNFT)
  }

  return { invalidNFTs, fetchRes }
}

// Function to check if a URL is valid
async function checkNFTValidity(nft) {
  try {
    const response = await axios.get(nft.metadata_uri)
    const data = response.data
    // Do something with the data
    if (fetchRes === null) fetchRes = data
  } catch (error) {
    return nft
  }
}
