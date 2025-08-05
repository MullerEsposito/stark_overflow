// E2E testing for adding stake

describe('Adding Stake for a question inside ReactJS forum', () => {
    beforeEach(() => {
        cy.visit('/forum/reactjs')
    })

    it('Navigate to ReactJS forum, search for question', ()=>{
        cy.contains('Loading forum...', { timeout: 10000 }).should('not.exist')
        // for testing we are searching specific test that is not answered
        cy.get('[data-cy=search-input]').type('Question of test')
        cy.wait(500)

        cy.get('body').then(($body) => {
            const questionLinks = $body.find('a[href*="/question/"]')
            // for testing we are using un-answered question
            if (questionLinks.length > 0) {
                cy.get('a[href*="/question/3"]').first().should('be.visible').click()
                cy.url().should('include', '/question/3')
            } else {
                cy.log('No questions available to click')
            }
        })

        cy.wait(1000)

        // connect wallet
        cy.get('[data-cy=connect-wallet-btn]').should('be.visible').click()

        // click add stake button - using {force:true} to click even if covered by another element
        cy.get('[data-cy=add-stake-btn-card]').should('exist').scrollIntoView().click({ force: true })

        // add stake amount in input
        cy.get('[data-cy=stake-amount-input]').should('be.visible').type('1')

        // add stake
        cy.get('[data-cy=add-stake-btn-popup]').should('be.visible').click()
        
    })
})