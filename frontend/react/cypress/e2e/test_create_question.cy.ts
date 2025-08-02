// E2E test to create a question
describe('Test Create a question in ReactJS forum', () => {

  beforeEach(() => {
    // Visit the forum page before each test
    cy.visit('/forum/reactjs')
  })

  it('should navigate to create question page', () => {
    cy.get('[data-cy=new-question-button]').click()
    cy.url().should('include', '/question')
  })

  // Test for empty form validation
  it('should display validation errors for empty form submission', () => {
    cy.get('[data-cy=new-question-button]').click()

    cy.get('[data-cy=publish-button]').scrollIntoView()
    
    cy.get('[data-cy=publish-button]').click({ force: true })
    
    cy.contains('Title is required').should('be.visible')
    cy.contains('Description is required').should('be.visible')
    cy.contains('Amount is required').should('be.visible')
  })

    // Test for invalid input lengths
  it('should display validation errors for invalid input lengths', () => {
    cy.get('[data-cy=new-question-button]').click()
    
    cy.get('#title').type('Short')
    
    cy.get('#description').type('Too short description')
    
    cy.get('[data-cy=publish-button]').scrollIntoView()
    
    // Try to submit - using force: true to bypass visibility checks
    cy.get('[data-cy=publish-button]').click({ force: true })
    
    // Check for validation errors
    cy.contains('Title should be at least 10 characters').should('be.visible')
    cy.contains('Description should be at least 30 characters').should('be.visible')
    cy.contains('Amount is required').should('be.visible')
  })

  it('should successfully fill out and submit the question form', () => {
    cy.get('[data-cy=new-question-button]').click()
    
    cy.get('#title').type('How to implement useEffect hook in React properly?')
    cy.get('#title').should('have.value', 'How to implement useEffect hook in React properly?')
    
    cy.get('#amount').type('10')
    cy.get('#amount').should('have.value', '10')
    
    // Fill out the description field (assuming it's a textarea or rich editor)
    const description = 'I am having trouble understanding how to properly implement the useEffect hook in React. I need to fetch data from an API when the component mounts, but I am getting infinite re-renders. Could someone please explain the correct way to use dependencies array?'
    cy.get('#description').type(description)
    cy.get('#description').should('contain.value', description)
    
    cy.get('#repository').type('https://github.com/username/react-project')
    cy.get('#repository').should('have.value', 'https://github.com/username/react-project')

    cy.get('#tags').type('react hooks useEffect javascript ')
    const expectedTags = ['react', 'hooks', 'useEffect', 'javascript']
    cy.get('[data-testid="tags-container"]')
      .within(() => {
        expectedTags.forEach((tag) => {
          cy.contains(tag).should('be.visible')
        })
      })
    
    cy.get('[data-cy=publish-button]').scrollIntoView()
    
    cy.get('[data-cy=publish-button]').should('not.be.disabled').click({ force: true })
    
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

  it('should display all form fields with correct placeholders', () => {
    cy.get('[data-cy=new-question-button]').click()
    
    cy.get('#title').should('be.visible')
    cy.get('#amount').should('be.visible')
    cy.get('#description').should('be.visible')
    cy.get('#repository').should('be.visible').should('have.attr', 'placeholder', 'http://github.com/username/repo')
    cy.get('#tags').should('be.visible').should('have.attr', 'placeholder', 'e.g. react hooks typescript')
    
    cy.contains('button', 'Discard').should('be.visible')
    cy.get('[data-cy=publish-button]').scrollIntoView().should('exist')
  })

  it('should allow discarding the question', () => {
    cy.get('[data-cy=new-question-button]').click()
    
    cy.get('#title').type('Test question title')
    cy.get('#amount').type('10')
    
    cy.contains('button', 'Discard').scrollIntoView().click({ force: true })
    
    cy.url().should('include', '/forum/reactjs')
  })


})