// E2E testing for answering

describe("Answering the question in ReactJS forum", ()=>{
    beforeEach(() => {
        cy.visit('/forum/reactjs')
    })

    it('Search for a question, check Add Stake button visibility, and answer if possible', ()=>{
        cy.contains('Loading forum...', { timeout: 10000 }).should('not.exist')
        // for testing we are searching specific test that is not answered
        cy.get('[data-cy=search-input]').type('Question of test')
        cy.wait(500)

        cy.get('body').then(($body) => {
            const questionLinks = $body.find('a[href*="/question/"]')
            if (questionLinks.length > 0) {
                cy.get('a[href*="/question/"]').first().then(($link) => {
                    const href = $link.attr('href')
                    const questionId = href?.match(/\/question\/(\d+)/)?.[1]
                    cy.log(`Clicking on question with ID: ${questionId}`)
                
                    cy.get('a[href*="/question/"]').first().should('be.visible').click()
                    
                    // Verify URL contains the question path
                    cy.url().should('include', '/question/')
                })
            } else {
                cy.log('No questions available to click')
            }
        })

        // Check if the question can be answered or is already answered
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy=submit-answer]').length > 0) {    
                // Question is not answered
                cy.get('[data-cy=add-stake-btn-card]').should('exist')
                
                // answer the question
                cy.get('[data-cy=answer-this-question]').type('This is a test answer testing for answering the question')

                // submit the answer
                cy.get('[data-cy=submit-answer]').click({force: true})

                // Handle wallet interaction and submission process
                cy.get('body').then(($body) => {
                    if ($body.text().includes('No StarkNet wallets detected')) {
                        cy.contains('No StarkNet wallets detected').should('be.visible')
                        cy.contains('Install ArgentX').should('be.visible')
                        cy.contains('Install Braavos').should('be.visible')
                    } else {
                        cy.contains('Available').click()
                        cy.wait(500)
                    }
                })
            } else {
                // Question is already answered
                cy.get('[data-cy=add-stake-btn-card]').should('not.exist')
            }
        })

    })

})