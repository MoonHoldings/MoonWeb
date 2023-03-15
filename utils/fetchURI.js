async function checkNft(nft) {
  try {
    const response = await fetch(nft.metadata_uri)
    if (!response.ok) {
      throw new Error(
        `${nft.metadata_uri} returned ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return { uri: nft.metadata_uri, data }
  } catch (error) {
    return { uri: nft.metadata_uri, error }
  }
}

export default async (nfts) => {
  const results = await Promise.all(nfts.map(checkNft))
  const errors = results.filter((result) => result.error)
  const invalidUrls = errors.map((result) => result.uri)
  return invalidUrls
}

// const urls = [
//   'https://jsonplaceholder.typicode.com/todos/1',
//   'https://jsonplaceholder.typicode.com/todos/invalid-url',
//   'https://jsonplaceholder.typicode.com/todos/3',
//   'https://jsonplaceholder.typicode.com/todos/invalid-url-2',
// ]

// checkUrls(urls)
//   .then((invalidUrls) => console.log('Invalid URLs:', invalidUrls))
//   .catch((error) => console.error(error))
