describe('Wallet', () => {
  const baseUrl = 'http://localhost:3000'
  const apiGraphQL = 'http://localhost/graphql'
  const email = 'test@email.com'
  const password = 'testPassword'

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
                total: 10,
                percentChange: -90,
                __typename: 'UserDashboardData',
              },
              nft: {
                total: 0,
                percentChange: -100,
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
              percentChangeTotal: -100,
              __typename: 'UserDashboardResponse',
            },
          },
        })

        if (
          req.body.operationName === 'RemoveUserWallet' &&
          req.body.variables.wallet === '12345678'
        ) {
          req.alias = 'gqlRemoveWallet'
          req.reply({
            data: {
              removeUserWallet: true,
            },
          })
        }

        if (
          req.body.operationName === 'AddUserWallet' &&
          req.body.variables.wallet === '12345678' &&
          req.body.variables.verified === true
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
                  address: '12345678',
                  verified: true,
                  __typename: 'Wallet',
                },
                // add more wallet objects if needed
              ],
            },
          })
        }
      }
    })
    cy.setCookie('aid', 'test-cookie')
  })

  it('should add a wallet', () => {
    cy.visit(`${baseUrl}/login`)
    // cy.login(email, password)
    cy.get('button#btn-wallet-mobile').click()
    cy.get('button').contains('Add Wallet Address').click()
    cy.get('div.search').type('12345678')
    cy.get('button#btn-add-wallet').click()
  })
})
