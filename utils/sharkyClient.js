const { createSharkyClient } = require('@sharkyfi/client')
const { default: createAnchorProvider } = require('./createAnchorProvider')

const provider = createAnchorProvider()
const sharkyClient = createSharkyClient(provider)

export default sharkyClient
