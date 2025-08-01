import { RPC_URL, SELECTORS, MOCK_ACCOUNT, CONTRACT_ADDRESS } from "../support/constants";

describe("Test Create Forum with Mocked State", () => {

  it("should validate successful forum creation workflow", () => {
    let isAfterSubmit = false;
    cy.intercept("POST", RPC_URL, (req) => {
      if (
        req.body.params?.request?.entry_point_selector ===
        SELECTORS.GET_ALL_FORUMS
      ) {
        if (isAfterSubmit) {
          console.log(
            "[Intercept] Switch is ON. Replying with updated forums."
          );
          req.reply({ fixture: "forums-after-creation.json" });
        } else {
          console.log(
            "[Intercept] Switch is OFF. Replying with initial forums."
          );
          req.reply({ fixture: "forums-initial-state.json" });
        }
        return;
      }
      if (req.body.params?.request?.entry_point_selector === SELECTORS.GET_OWNER) {
        console.log('[Intercept] Replying to owner check call.');

        const feltOwner = BigInt(MOCK_ACCOUNT).toString();
        // Responde com o endereço do nosso usuário mockado.
        // A resposta crua de um 'felt' é um array com um único elemento.
        req.reply({
          statusCode: 200,
          body: { result: [feltOwner] } 
        });
        return;
      }
      req.continue();
    }).as("getForums");

    cy.setupE2E({ walletInstalled: true });
    cy.visit("/");
    cy.wait("@getForums");
   
    cy.login();

    cy.get('[data-cy="forum-list"]').children().should("have.length", 3);

    cy.get("[data-cy=create-forum]").click();
    cy.get("[data-cy=InputForm-name]").type("Forum cypress 3");
    cy.get("[data-cy=InputForm-icon-url]").type("https://example.com/icon.png");

    cy.then(() => {
      isAfterSubmit = true;
    });

    cy.get("[data-cy=create-forum-button]").click();
    cy.wait("@getForums");

    // Validate the new forum exists
    cy.contains("Forum cypress 3").should("be.visible");
    cy.get('[data-cy="forum-list"]').children().should("have.length", 4);
  });
});
