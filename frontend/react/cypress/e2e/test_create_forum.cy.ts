describe("Test Create Forum with Mocked State", () => {

  it("should validate successful forum creation workflow", () => {

    cy.setupE2E({ walletInstalled: true });
    cy.visit("/");
   
    cy.login();

    cy.get('[data-cy="forum-list"]').should('not.contain', 'Fórum de Teste');

    cy.get("[data-cy=create-forum]").click();
    cy.get("[data-cy=InputForm-name]").type("Fórum de Teste da Pipeline");
    cy.get("[data-cy=InputForm-icon-url]").type("https://example.com/icon.png");


    cy.get("[data-cy=create-forum-button]").click();

    cy.contains("Fórum de Teste da Pipeline", { timeout: 10000 }).should("be.visible");
    cy.get('[data-cy="forum-list"]').children().should("have.length", 1);
  });

    it.only("should environment status click", () => {

    cy.setupE2E({ walletInstalled: true });
    cy.visit("/");
   
    cy.login();

 
    cy.get('[data-cy="environment-status"]').click();
    cy.wait(2000);

  });
});


