// E2E testing for adding stake

describe('Adding Stake for a question inside ReactJS forum', () => {
    beforeEach(() => {
        cy.visit('/forum/reactjs')
    })

    it('Navigate to ReactJS forum, search for question', ()=>{
        // // connect wallet
        // cy.get('[data-cy=connect-wallet-btn]').click({ force: true })
        // cy.get('Ready Wallet').click({ force: true })

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

        cy.wait(1000)

        // connect wallet
        cy.get('[data-cy=connect-wallet-btn]').click({ force: true })

        // click add stake button
        cy.get('[data-cy=add-stake-btn-card]').click({force: true})

        // add stake amount in input
        cy.get('[data-cy=stake-amount-input]').type('1')

        // add stake
        cy.get('[data-cy=add-stake-btn-popup]').click({force: true})
        
    })
})