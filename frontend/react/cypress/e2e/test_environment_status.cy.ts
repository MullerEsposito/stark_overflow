describe('Environment Status"', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should visible Environment Status warnning', () => {
     cy.setupWalletMocks();
     cy.visit('/')
    cy.contains('Environment Status:').click()
    
    cy.wait(3000)
  })
})
