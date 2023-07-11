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
              accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWx2YXJlem1pY29oQGdtYWlsLmNvbSIsImlhdCI6MTY4Njg0MzQ1OSwiZXhwIjoxNjg5NDM1NDU5fQ.x9NMt-4kNHn02BzjgZCJe0m5XO992P2o-7PCt4kWduc',
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
                name: 'MoonHolder #1165',
                symbol: 'MNH',
                image:
                  'https://bafybeigcy4hi3px6xn5ivmoymzyhdh4ddcmdnmqhdzjaujlcuh4xolea4m.ipfs.nftstorage.link/1164.png?ext=png',
                description:
                  "MoonHolders are the official NFT companions to the MoonHoldings.xyz portfolio app. With the Solana Blockchain as their home, these pixel art aliens provide holders with additional benefits and utility. With them in the driver's seat, you can keep your eyes on the Moon as you level up your investing habits.",
                collection: {
                  mint: null,
                  name: 'MoonHolders',
                  image:
                    'https://cdn.shyft.to/img/https%253A%252F%252Fbafybeigcy4hi3px6xn5ivmoymzyhdh4ddcmdnmqhdzjaujlcuh4xolea4m.ipfs.nftstorage.link%252F1155.png%253Fext%253Dpng',
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
