// E2E testing for answering

describe("Answering the question in ReactJS forum", ()=>{
    beforeEach(() => {
        cy.visit('/forum/reactjs')
    })

    it('Search for a question and navigate to it and answer the question', ()=>{
        cy.contains('Loading forum...', { timeout: 10000 }).should('not.exist')
        // for testing we are searching specific test that is not answered
        cy.get('[data-cy=search-input]').type('Question of test')
        cy.wait(500)

        cy.get('body').then(($body) => {
            const questionLinks = $body.find('a[href*="/question/"]')
            // for testing we are using un-answered question
            if (questionLinks.length > 0) {
                cy.get('a[href*="/question/3"]').first().click({ force: true })
                cy.url().should('include', '/question/3')
            } else {
                cy.log('No questions available to click')
            }
        })

        // answer the question
        cy.get('[data-cy=answer-this-question]').type('This is a test answer testing for answering the question')

        // submit the answer
        cy.get('[data-cy=submit-answer]').click({force: true})

        cy.get('body').then(($body) => {
            if ($body.text().includes('No StarkNet wallets detected')) {
                cy.contains('No StarkNet wallets detected').should('be.visible')
                cy.contains('Install ArgentX').should('be.visible')
                cy.contains('Install Braavos').should('be.visible')
            } else {
                cy.contains('Available').click()
                cy.wait(500)
                
                // // wallet will ask for password
                // cy.get('[data-cy=submit-answer]').click({force: true})
                // // Check for submitting state
                // cy.contains('Submitting...', { timeout: 10000 }).should('be.visible')
                // cy.contains('Failed to submit answer. Please try again.', { timeout: 15000 }).should('be.visible')
            }
        })

    })

})