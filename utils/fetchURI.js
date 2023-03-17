import axios from 'axios'

export default async (nfts) => {
  const invalidNFTs = []

  for (const nft of nfts) {
    const invalidNFT = await checkNFTValidity(nft)
    if (invalidNFT) invalidNFTs.push(invalidNFT)
  }

  return invalidNFTs
}

// Function to check if a URL is valid
async function checkNFTValidity(nft) {
  try {
    const response = await axios.get(nft.metadata_uri)
    const data = response.data
    // Do something with the data
  } catch (error) {
    return nft
  }
}
