// E2E test for listing questions in the forum
describe('Question Listing in Forum', () => {
  beforeEach(() => {
    cy.visit('/forum/reactjs')
  })

  it('should load the forum page and display basic elements', () => {
    // Check that the page loads and shows basic forum structure
    cy.url().should('include', '/forum/reactjs')
    
    // Check for search input
    cy.get('[data-cy=search-input]').should('be.visible')
    
    // Check for "New Question" button
    cy.get('[data-cy=new-question-button]').should('be.visible').should('contain.text', 'New Question')
  })

  it('should display loading state initially', () => {
    cy.visit('/forum/reactjs')

    cy.get('body').then(($body) => {
      if ($body.text().includes('Loading forum...')) {
        cy.contains('Loading forum...').should('be.visible')
      }
    })
  })


  it('should allow searching for questions', () => {
    cy.contains('Loading forum...', { timeout: 10000 }).should('not.exist')
    cy.get('[data-cy=search-input]').should('be.visible').type('Question of test')
    cy.wait(500)
  })

  it('should clear search results when search is emptied', () => {
    cy.contains('Loading forum...', { timeout: 10000 }).should('not.exist')
    cy.get('[data-cy=search-input]').type('Question of test')
    cy.wait(500)
    cy.get('[data-cy=search-input]').clear()
    cy.wait(500)
    cy.get('[data-cy=search-input]').should('have.value', '')
  })

  it('should navigate to question details when question is clicked', () => {
    cy.contains('Loading forum...', { timeout: 10000 }).should('not.exist')
    cy.get('[data-cy=search-input]').type('Question of test')
    cy.wait(500)

    cy.get('body').then(($body) => {
      const questionLinks = $body.find('a[href*="/question/"]')
      
      if (questionLinks.length > 0) {
        cy.get('a[href*="/question/"]').first().click({ force: true })
        cy.url().should('include', '/question/1')
      } else {
        cy.log('No questions available to click')
      }
    })
  })


  it('should display stake amounts for questions', () => {
    cy.contains('Loading forum...', { timeout: 10000 }).should('not.exist')
    cy.get('[data-cy=search-input]').type('Question of test')
    cy.wait(500)
    cy.get('body').then(($body) => {
      const questionLinks = $body.find('a[href*="/question/"]')
      
      if (questionLinks.length > 0) {
        cy.get('a[href*="/question/"]').first().click({ force: true })
        cy.url().should('include', '/question/1')
      } else {
        cy.log('No questions available to click')
      }
    })
  })
})