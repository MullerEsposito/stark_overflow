import { RPC_URL, SELECTORS } from "../support/constants";

describe("Test Create Forum with Mocked State", () => {
  beforeEach(() => {
    cy.setupWalletMocks();
    cy.visit("/");
  });

  it("should allow a user to connect, create a question, and see it in the list", () => {
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

      req.continue();
    }).as("getForums");

    cy.visit("/");
    cy.wait("@getForums");
    cy.login();

    const newQuestionTitle = "Forum cypress 3";

    cy.get("[data-cy=create-forum]").click();
    cy.get("[data-cy=InputForm-name]").type(newQuestionTitle);
    cy.get("[data-cy=InputForm-icon-url]").type(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUeKvNdCDsuFrsh9GaPbdQpRkVMzdZ6Ba5Gw&s"
    );

    cy.then(() => {
      isAfterSubmit = true;
    });

    cy.get("[data-cy=create-forum-button]").click();

    cy.wait("@getForums");

    cy.contains(newQuestionTitle).should("be.visible");
  });

  it("should validate forum creation form without ForumName field", () => {
    cy.login();

    cy.get("[data-cy=create-forum]").click();

    cy.get("[data-cy=InputForm-name]").should("be.visible");
    cy.get("[data-cy=InputForm-icon-url]").should("be.visible");
    cy.get("[data-cy=create-forum-button]").should("be.visible");

    cy.get("[data-cy=create-forum-button]").click();

    cy.contains("name is required").should("be.visible");
  });

  it("should validate forum creation form without icon field", () => {
    cy.login();

    cy.get("[data-cy=create-forum]").click();

    cy.get("[data-cy=InputForm-name]").should("be.visible");
    cy.get("[data-cy=InputForm-icon-url]").should("be.visible");
    cy.get("[data-cy=create-forum-button]").should("be.visible");
    cy.get("[data-cy=InputForm-name]").type("Name Forum");

    cy.get("[data-cy=create-forum-button]").click();

    cy.contains("Icon URL is required").should("be.visible");
  });

  it("should validate forum creation with invalid data", () => {
    cy.login();

    cy.get("[data-cy=create-forum]").click();

    // Test with invalid name (too short)
    cy.get("[data-cy=InputForm-name]").type("ab");
    cy.get("[data-cy=InputForm-icon-url]").type("invalid-url");

    cy.get("[data-cy=create-forum-button]").click();

    // Should show validation errors
    cy.contains("Name should be at least 3 characters").should("be.visible");
    cy.contains("Icon URL must be a valid URL").should("be.visible");
    cy.contains("Failed to load image").should("be.visible");
  });

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

      req.continue();
    }).as("getForums");

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
