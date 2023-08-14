describe('NFT', () => {
  const baseUrl = 'http://localhost:3000'
  const apiGraphQL = 'http://localhost/graphql'
  const email = 'test@email.com'
  const password = 'testPassword'
  const testWalletAddress = '3bpETYgcq63kWs86BEnWM4QiBUisfP8BrmjHYGjsHL11'

  beforeEach(() => {
    cy.intercept('POST', apiGraphQL, (req) => {
      const { body } = req
      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'Mutation' &&
        req.body.query.includes('login')
      ) {
        req.alias = 'gqlLogin'
        req.reply({
          data: {
            login: {
              username: 'testUser',
              accessToken: 'testAccessToken',
              __typename: 'User',
            },
          },
        })
      }
      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'Mutation' &&
        req.body.query.includes('logout')
      ) {
        req.alias = 'gqlLogout'
        req.reply({
          data: {
            logout: {},
          },
        })
      }

      if (req.body.operationName === 'GetUserNfts') {
        req.alias = 'gqlGetUserNfts'
        req.reply({
          data: {
            getUserNfts: [
              {
                mint: 'rndmmint',
                attributes:
                  '{"Background":"Yellow","Skin":"Robot","Eyes":"Wink","Head":"Antenna","Body":"None","Mouth":"Black Beard"}',
                attributesArray:
                  '[{"trait_type":"Background","value":"Yellow"},{"trait_type":"Skin","value":"Robot"},{"trait_type":"Eyes","value":"Wink"},{"trait_type":"Head","value":"Antenna"},{"trait_type":"Body","value":"None"},{"trait_type":"Mouth","value":"Black Beard"}]',
                owner: testWalletAddress,
                name: 'DoggyDogTest #1165',
                symbol: 'MNH',
                image:
                  'https://blogs.airdropalert.com/wp-content/uploads/2021/09/top-dog-beach-club.png',
                description:
                  "DoggyDog are the official NFT companions to dogs. With the Solana Blockchain as their home, these pixel art aliens provide holders with additional benefits and utility. With them in the driver's seat, you can keep your eyes on the Moon as you level up your investing habits.",
                collection: {
                  mint: null,
                  name: 'DoggyDogTest',
                  image:
                    'https://blogs.airdropalert.com/wp-content/uploads/2021/09/top-dog-beach-club.png',
                  floorPrice: 3000000000000,
                  __typename: 'NftCollection',
                },
                __typename: 'Nft',
              },
            ],
          },
        })
      }
    })
  })

  it('should check if NFT exists', () => {
    cy.login(email, password)
    cy.get('button#btn-hamburger').click()
    cy.get('button').contains('NFTs').click()
    cy.location('pathname').should('eq', '/nfts')
    cy.get('div').get('div').contains('3,000').should('exist')
  })
})
