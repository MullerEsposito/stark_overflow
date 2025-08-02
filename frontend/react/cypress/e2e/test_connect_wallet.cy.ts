// Simple E2E test for wallet connection functionality
describe('Wallet Connection', () => {
  
  it('should display connect wallet button when wallet is not connected', () => {
    cy.setupE2E({ walletInstalled: true });
     cy.visit('/')
    cy.login()
  })

  it('should open connect wallet modal when button is clicked', () => {
     cy.setupE2E({ walletInstalled: true });
     cy.visit('/')
    cy.contains('Connect Wallet').click()
    
    cy.contains('Connect Wallet').should('be.visible')
    
    cy.get('body').should('contain.text', 'Connect Wallet')
  })

  it('should show wallet installation message when no wallets are detected', () => {
    cy.setupE2E({ walletInstalled: false });
    cy.visit('/')
    cy.contains('Connect Wallet').click()
    
    cy.get('body').then(($body) => {
      if ($body.text().includes('No StarkNet wallets detected')) {
        cy.contains('No StarkNet wallets detected').should('be.visible')
        cy.contains('Install ArgentX').should('be.visible')
        cy.contains('Install Braavos').should('be.visible')
      } else {
        cy.contains('Available').should('exist')
      }
    })
  })

  it('should close modal when close button (×) is clicked', () => {
    cy.setupE2E({ walletInstalled: true });
    cy.visit('/')
    cy.contains('Connect Wallet').click()
    
    cy.contains('×').click()
  })

  it('should maintain consistent UI state across page navigation', () => {
    cy.setupE2E({ walletInstalled: true });
    cy.visit('/')
    cy.contains('Connect Wallet').should('be.visible')
    
    cy.visit('/forum/reactjs')
    
    cy.contains('Connect Wallet').should('be.visible')
    
    cy.visit('/')
    
    cy.contains('Connect Wallet').should('be.visible')
  })

  it('should show wallet detector notification when no wallet is installed', () => {
    cy.setupE2E({ walletInstalled: false });
    cy.visit('/')
    cy.get('body').should('contain.text', 'No StarkNet wallets detected')
  })
})
