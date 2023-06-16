describe('Wallet', () => {
  const baseUrl = 'http://localhost:3000'
  const apiGraphQL = 'http://localhost/graphql'
  const email = 'test@email.com'
  const password = 'testPassword'
  const testWalletAddress = '3bpETYgcq63kWs86BEnWM4QiBUisfP8BrmjHYGjsHL11'

  beforeEach(() => {
    cy.visit(`${baseUrl}/login`)
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
              __typename: 'User',
            },
          },
        })
      }

      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'GetUserDashboard'
      ) {
        req.alias = 'gqlDashboard'

        req.reply({
          data: {
            getUserDashboard: {
              crypto: {
                total: 1584021,
                percentChange: 87,
                __typename: 'UserDashboardData',
              },
              nft: {
                total: 20258,
                percentChange: 47,
                __typename: 'UserDashboardData',
              },
              loan: {
                total: 0,
                percentChange: 0,
                __typename: 'UserDashboardData',
              },
              borrow: {
                total: 0,
                percentChange: 0,
                __typename: 'UserDashboardData',
              },
              percentChangeTotal: 134,
              __typename: 'UserDashboardResponse',
            },
          },
        })
      }

      if (
        req.body.operationName === 'Mutation' &&
        req.body.query.includes('removeAllUserWallets')
      ) {
        req.alias = 'gqlRemoveAllWallets'
        req.headers['Authorization'] = 'Bearer fakeToken'
        req.reply({
          data: {
            removeAllUserWallets: true,
          },
        })
      }

      if (
        req.body.operationName === 'AddUserWallet' &&
        req.body.variables.wallet === testWalletAddress
      ) {
        req.alias = 'gqlAddWallet'
        req.reply({
          data: {
            addUserWallet: true,
          },
        })
      }

      if (
        req.body.operationName === 'GetUserWallets' &&
        req.body.variables.type === 'Auto'
      ) {
        req.alias = 'gqlGetWallet'
        req.reply({
          data: {
            getUserWallets: [
              {
                id: '1',
                address: testWalletAddress,
                verified: true,
                __typename: 'Wallet',
              },
              // add more wallet objects if needed
            ],
          },
        })
      }
    })
    cy.setCookie('aid', 'test-aid-cookie')
  })

  it('should add a wallet', () => {
    cy.visit(`${baseUrl}/login`)
    cy.get('button#btn-wallet-mobile').click()
    cy.get('button').contains('Add Wallet Address').click()
    cy.get('div.search').type(testWalletAddress)
    cy.get('button#btn-add-wallet').click()
    cy.get('ul.all-wallets').contains('3bpET').should('exist')
  })

  // TODO NFT TESTS NEED TO BE COMPLETED FIRST
  // it('should remove all wallets', () => {
  //   cy.visit(`${baseUrl}/login`)
  //   // cy.login(email, password)
  //   cy.get('button#btn-wallet-mobile').click()
  //   cy.contains('Disconnect Wallets').click()
  //   cy.contains('3bpET').should('not.exist')
  // })
})
