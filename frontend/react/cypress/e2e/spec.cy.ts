// Simple demo test to get familiar with Cypress

// 1. Visit a web page.
// 2. Query for an element.
// 3. Interact with that element.
// 4. Assert about the content on the page.

describe('Visit the page', () => {
  it('Visits the Kitchen Sink', () => {
    // visit the link
    cy.visit('https://example.cypress.io')

    // check component on the page
    cy.contains('type').click()

    // check the url is correctly rendering
    cy.url().should('include', 'https://example.cypress.io/commands/actions')

    // querying the input field
    cy.get('.action-email').type('fake@email.com')

    // verify the input field has the correct value
    cy.get('.action-email').should('have.value', 'fake@email.com')
  })
})