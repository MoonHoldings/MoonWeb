// describe('App Loads on NFT Portfolio!', () => {
//   const test_1_wallet = '59P4YJwKsUrKhxbFvB2t6JWv37YDRcoMzTJwWGEZhZ2e'

//   beforeEach(() => {
//     cy.visit('http://localhost:3000/nfts')
//   })

//   it('HomeHeader contains correct elements', () => {
//     cy.contains('MoonHoldings')
//     cy.contains('Welcome to MoonHoldings')
//     // cy.get('header > h1 > a').should('have.attr', 'title', 'MoonHoldings.xyz')
//   })

//   it('Interact with Navbar buttons', () => {
//     cy.get('button#btn-wallet-mobile').click()
//     cy.contains('Add Wallet Address')
//     cy.get('button#btn-hamburger').click()
//     cy.get('button#btn-nft-portfolio')
//     cy.get('button#btn-left-sidebar-arrow').click()
//     cy.contains('button#btn-nft-portfolio').should('not.exist')
//   })

//   it('Add Wallet Address', () => {
//     cy.get('button#btn-wallet-mobile').click()
//     cy.get('div#btn-add-wallet-address').click()
//     cy.contains('Add your Solana wallet')
//     cy.contains('Wallet Address')
//     cy.contains('Add Wallet')
//     cy.get('input').type(test_1_wallet)
//     cy.get('button#btn-add-wallet').click()
//     cy.contains('Processing...')
//   })
// })

// describe('Homepage', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:3000', { timeout: 10000 })
//   })

//   it('Loads successfully', () => {
//     cy.url().should('eq', 'http://localhost:3000/')
//   })

//   it('has working Signup link', () => {
//     cy.contains('button', 'Signup', { timeout: 5000 }).click()
//     cy.url().should('eq', 'http://localhost:3000/signup')
//   })

//   it('has working Login link', () => {
//     cy.visit('http://localhost:3000', { timeout: 10000 })
//     cy.contains('button', 'Login', { timeout: 5000 }).click()
//     cy.url().should('eq', 'http://localhost:3000/login')
//   })
// })

describe('Login', () => {
  const email = Cypress.env('email')
  const password = Cypress.env('password')

  beforeEach(() => {
    cy.visit('http://localhost:3000/login', { timeout: 10000 })
    cy.setCookie('aid', 'sdkjvsodfkjslkdfjsldfkjsdfsfdkldflksfsldfksdlkf')
  })

  it('Logs in successfully', () => {
    cy.intercept('POST', 'http://localhost/graphql', (req) => {
      if (
        req.body.operationName === 'Mutation' &&
        req.body.query.includes('login')
      ) {
        req.reply({
          data: {
            login: {
              username: 'OddlyJoviallyConcerned',
              __typename: 'User',
            },
          },
        })
      }
    }).as('loginRequest')

    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('form').submit()

    cy.getCookie('aid').should('exist')

    cy.url().should('eq', 'http://localhost:3000/dashboard')
  })
})
