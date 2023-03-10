describe('App Loads on NFT Portfolio!', () => {
  const test_1_wallet = '59P4YJwKsUrKhxbFvB2t6JWv37YDRcoMzTJwWGEZhZ2e'

  beforeEach(() => {
    cy.visit('http://localhost:3000/nfts')
  })

  it('HomeHeader contains correct elements', () => {
    cy.contains('MoonHoldings')
    cy.contains('Welcome to MoonHoldings')
    // cy.get('header > h1 > a').should('have.attr', 'title', 'MoonHoldings.xyz')
  })

  it('Interact with Navbar buttons', () => {
    cy.get('button#btn-wallet-mobile').click()
    cy.contains('Add Wallet Address')
    cy.get('button#btn-hamburger').click()
    cy.get('button#btn-nft-portfolio')
    cy.get('button#btn-left-sidebar-arrow').click()
    cy.contains('button#btn-nft-portfolio').should('not.exist')
  })

  it('Add Wallet Address', () => {
    cy.get('button#btn-wallet-mobile').click()
    cy.get('div#btn-add-wallet-address').click()
    cy.contains('Add your Solana wallet')
    cy.contains('Wallet Address')
    cy.contains('Add Wallet')
    cy.get('input').type(test_1_wallet)
    cy.get('button#btn-add-wallet').click()
    cy.contains('Processing...')
  })
})
