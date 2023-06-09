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

describe('Homepage Test', () => {
  beforeEach(() => {
    // Visit homepage before each test
    cy.visit('http://localhost:3000', { timeout: 10000 })
  })

  it('Loads successfully', () => {
    cy.url().should('eq', 'http://localhost:3000/')
  })

  it('has working Signup link', () => {
    // Find the Signup button and click it
    cy.contains('button', 'Signup', { timeout: 5000 }).click()

    // Check if it redirects to the correct page
    cy.url().should('eq', 'http://localhost:3000/signup')
  })

  it('has working Login link', () => {
    // Go back to homepage
    cy.visit('http://localhost:3000', { timeout: 10000 })

    // Find the Login button and click it
    cy.contains('button', 'Login', { timeout: 5000 }).click()

    // Check if it redirects to the correct page
    cy.url().should('eq', 'http://localhost:3000/login')
  })
})

// describe('Login', () => {
//   const email = Cypress.env('email')
//   const password = Cypress.env('password')

//   before(() => {
//     cy.visit('http://localhost:3000', { timeout: 10000 })
//   })

//   it('Navigate to login', () => {
//     cy.contains('MoonHoldings', { timeout: 10000 })
//     cy.get('button').contains('Login').click()
//   })

//   it('Should successfully login', () => {
//     cy.visit('http://localhost:3000/login')
//     cy.get('input[type=email').type(email)
//     cy.get('input[type=password').type(password)
//     cy.get('button').contains('Login').click()

//     cy.wait(10000)
//     cy.url().should('include', 'http://localhost:3000/dashboard')
//   })

//   it('Dashboard', () => {
//     cy.visit('http://localhost:3000/dashboard')
//     cy.contains('Performance')
//     cy.contains('Total Networth')
//   })
// })
