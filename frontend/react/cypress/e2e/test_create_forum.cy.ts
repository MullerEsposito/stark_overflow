describe("Test Create Forum with Mocked State", () => {

  it("should validate successful forum creation workflow", () => {

    cy.setupE2E({ walletInstalled: true });
    cy.visit("/");
   
    cy.login();

    cy.get('[data-cy="forum-list"]').should('not.contain', 'Forum cypress');

    cy.get("[data-cy=create-forum]").click();
    cy.get("[data-cy=InputForm-name]").type("Forum cypress");
    cy.get("[data-cy=InputForm-icon-url]").type("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUeKvNdCDsuFrsh9GaPbdQpRkVMzdZ6Ba5Gw&s");
    cy.wait(2000)

    cy.get("[data-cy=create-forum-button]").click();

    cy.visit("/");
    cy.contains("Forum cypress", { timeout: 10000 }).should("be.visible");
  });

});


